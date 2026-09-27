-- ============================================================================
-- AptiX — performance migration for the questions table
--
-- Run this in the Supabase SQL Editor. It is safe to re-run: every statement is
-- guarded with IF NOT EXISTS.
--
-- Nothing here is required for the application to work. The JavaScript refactor
-- already moved filtering, counting, ordering and limiting into SQL, which is
-- where most of the win came from. This file adds the supporting structures so
-- those queries stay fast as the table grows.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. INDEXES
--
-- Chosen from the queries the application actually issues, not from every column
-- the table happens to have. Each one below lists the query it serves.
--
-- A note on why composite indexes: these queries almost always filter on one
-- column AND order by id. A composite index on (filter, id) lets Postgres satisfy
-- both from the index alone — no sort step, and it can stop reading early once
-- enough rows are found.
-- ----------------------------------------------------------------------------

-- Serves: the subtopic index scan (WHERE category IN (...) AND id > last ORDER BY id)
--          every category count on the homepage cards
--          the category half of a subtopic quiz
-- `category` alone needs no separate index: it is the leading column here, so
-- queries filtering only on category can still use this index.
create index if not exists idx_questions_category_id
  on public.questions (category, id);

-- Serves: company practice counts (WHERE company = ...)
--          company quizzes (WHERE company = ... ORDER BY id)
create index if not exists idx_questions_company_id
  on public.questions (company, id);

-- Serves: the subcategory branch of a subtopic quiz
--   WHERE subcategory IN ('percentage', 'percentages', ...)
create index if not exists idx_questions_subcategory
  on public.questions (subcategory);

-- Serves: the topic_slug branch of a subtopic quiz, used when a question was
-- imported without a subcategory and is filed under its topic instead.
create index if not exists idx_questions_topic_slug
  on public.questions (topic_slug);


-- ----------------------------------------------------------------------------
-- 2. DIFFICULTY FILTERING — optional, read this before running
--
-- The JavaScript still filters by difficulty after fetching, because two column
-- names could not be confirmed from the repository (`difficulty` and
-- `correctAnswer`). A `select()` naming a column that does not exist is a hard
-- Postgres error, so guessing would have broken every quiz.
--
-- VERIFY FIRST which column holds the difficulty:
--
--   select column_name, data_type
--   from information_schema.columns
--   where table_name = 'questions'
--     and column_name in ('difficulty', 'level');
--
-- Then run ONE of the two blocks below. `level` is the column used by
-- database/sampleQuestions.sql; if the result above shows `difficulty` instead,
-- use the second block.
--
-- Once difficulty_key exists, filtering moves into SQL and the pool-size
-- headroom in QuizPage/CompanyQuizPage can drop to exactly the requested count:
--
--   getQuestions({ category, company, difficulty: 'medium', limit: 10 })
--
-- which the data layer would turn into `.eq('difficulty_key', 'medium')`.
-- ----------------------------------------------------------------------------

-- Block A — if the column is `level`:
--
-- create index if not exists idx_questions_difficulty_key
--   on public.questions (difficulty_key);
--
-- alter table public.questions
--   add column if not exists difficulty_key text
--   generated always as (lower(trim(coalesce(level, '')))) stored;

-- Block B — if the column is `difficulty`, use this instead:
--
-- alter table public.questions
--   add column if not exists difficulty_key text
--   generated always as (lower(trim(coalesce(difficulty, '')))) stored;
--
-- create index if not exists idx_questions_difficulty_key
--   on public.questions (difficulty_key);


-- ----------------------------------------------------------------------------
-- 2b. DIAGNOSTICS — run these if a filter returns nothing
--
-- The JavaScript now filters with `.in('category', [...])`, which is an EXACT,
-- case-sensitive comparison in Postgres. The JavaScript filter it replaced used
-- `toLowerCase().trim()` first, so it matched 'Quant', 'QUANT' and 'quant '
-- alike. If the category column holds any value that differs in case or has
-- trailing whitespace, the new query will silently return nothing where the old
-- one returned rows.
--
-- Run this to see the values that actually exist:
--
--   select category, count(*)
--   from public.questions
--   group by category
--   order by count(*) desc;
--
-- Run this to find company rows whose category is not one the app knows about:
--
--   select distinct q.category, count(*)
--   from public.questions q
--   where q.company is not null
--   group by q.category
--   order by count(*) desc;
--
-- If you see mixed case or padding, add a normalised column and index it, then
-- switch applyFilters() in src/lib/supabase.js from
--     .in('category', aliases)
-- to
--     .in('category_key', aliases)
--
--   alter table public.questions
--     add column if not exists category_key text
--     generated always as (lower(trim(coalesce(category, '')))) stored;
--
--   create index if not exists idx_questions_category_key_id
--     on public.questions (category_key, id);
--
--   update src/lib/supabase.js:
--     const INDEX_COLUMNS = 'id, category, category_key, subcategory, topic_slug';
--     next = next.in('category_key', getCategoryAliases(category));
--
-- Do not skip this step on the assumption the data is clean — the whole reason
-- the alias table exists is that this column has been inconsistent before.
-- ----------------------------------------------------------------------------


-- ----------------------------------------------------------------------------
-- 3. SCALABLE RANDOM ORDERING — optional
--
-- getMockQuestions() uses order('random'), which makes Postgres sort every
-- matching row before taking the limit. That is fine at the current table size
-- and far cheaper than the old "download the whole table and shuffle in the
-- browser", but it is a full sort.
--
-- If the questions table grows past roughly 100k rows, add a random key and
-- order on it instead. A stable key column plus an index turns "give me N random
-- rows" into an index range scan.
-- ----------------------------------------------------------------------------

-- alter table public.questions
--   add column if not exists random_key double precision;
--
-- update public.questions set random_key = random() where random_key is null;
--
-- alter table public.questions
--   alter column random_key set default random();
--
-- create index if not exists idx_questions_random_key
--   on public.questions (random_key);
--
-- Then getMockQuestions() would become: start at a random point and wrap around.
--
--   const start = Math.random();
--   let rows = await supabase.from('questions').select('*')
--     .gte('random_key', start).order('random_key').limit(poolSize);
--   if (rows.length < poolSize) {
--     const wrapped = await supabase.from('questions').select('*')
--       .lt('random_key', start).order('random_key').limit(poolSize - rows.length);
--     rows = [...rows, ...wrapped];
--   }


-- ----------------------------------------------------------------------------
-- 4. RLS VERIFICATION
--
-- Authorization lives in Postgres, never in React. The anon key ships in the
-- JavaScript bundle by design; it identifies the project and grants nothing.
-- These policies are what actually protect the table.
--
-- database/fixPolicies.sql sets this up. Run that file, then use the queries
-- below to confirm the live database matches the repository.
-- ----------------------------------------------------------------------------

-- VERIFY 1 — RLS must be enabled, or the policies are irrelevant.
-- Expect: rowrowsecurity = true
select relrowsecurity as row_security_enabled
from pg_class
where oid = 'public.questions'::regclass;

-- VERIFY 2 — no write policy may remain for anonymous users.
-- Expect: ZERO rows. Any row here means the public can still write.
select policyname, cmd, roles
from pg_policies
where tablename = 'questions'
  and cmd <> 'select';

-- VERIFY 3 — read access must still be allowed.
-- Expect: at least one row with cmd = 'select'.
select policyname, cmd, roles
from pg_policies
where tablename = 'questions'
  and cmd = 'select';


-- ----------------------------------------------------------------------------
-- 5. ANSWER-KEY ARCHITECTURE — documented, not implemented
--
-- correct_answer and explanation are sent to the browser with every question,
-- because practice mode shows the answer and its explanation after each attempt.
-- That is a deliberate trade-off, acceptable for a free practice tool.
--
-- It stops being acceptable the moment any of these are added:
--
--   * competitive or proctored exams
--   * leaderboards or timed scored runs
--   * paid tests
--   * certificates
--   * any claim that results cannot be tampered with
--
-- The reason: a user can open devtools, read the correct answer for every
-- question before starting, and no client-side check can prevent it. Grading on
-- the client is grading on the user's machine.
--
-- The fix is server-side grading. The shape it would take:
--
--   create table public.quiz_attempts (
--     id uuid primary key default gen_random_uuid(),
--     user_id uuid references auth.users(id),
--     mode text not null,
--     score int,
--     total int,
--     started_at timestamptz default now(),
--     finished_at timestamptz
--   );
--
--   create table public.quiz_answers (
--     attempt_id uuid references public.quiz_attempts(id) on delete cascade,
--     question_id bigint not null,
--     chosen text,
--     is_correct boolean not null,
--     primary key (attempt_id, question_id)
--   );
--
-- The browser would post chosen answers and receive back only a score. Whether
-- each answer was correct stays in Postgres, readable only by the user and by a
-- service_role function. Deliberately not created here — it needs auth and a
-- product decision about accounts, neither of which this refactor requires.
