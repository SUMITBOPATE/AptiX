-- Questions are READ-ONLY over the public API.
--
-- The anon key ships to every visitor in the JS bundle, so any policy granting
-- insert/update/delete hands the internet an unauthenticated write API on the
-- production database: one console call could rewrite every correct_answer or
-- empty the question bank. The app only ever calls .select() — see
-- src/lib/supabase.js, which has no insert/update/delete/upsert anywhere.
--
-- Matches the read-only policy already used for public.topics in
-- topicsWithSubtopics.sql.

-- Required for the policies below to have any effect. Without this the table is
-- exposed outright, so it is not optional.
alter table public.questions enable row level security;

-- Remove the write grants. Idempotent, so it is safe to re-run.
drop policy if exists "Allow all insert on questions" on public.questions;
drop policy if exists "Allow all update on questions" on public.questions;
drop policy if exists "Allow all delete on questions" on public.questions;
drop policy if exists "Allow all write on questions" on public.questions;
drop policy if exists "Anyone can insert questions" on public.questions;
drop policy if exists "Anyone can update questions" on public.questions;
drop policy if exists "Anyone can delete questions" on public.questions;

-- Older read policies, replaced by the single canonical one below.
drop policy if exists "Anyone can view questions" on public.questions;
drop policy if exists "Allow all read on questions" on public.questions;

create policy "Anyone can read questions"
  on public.questions
  for select
  using (true);

-- Adding or editing questions is a database-admin task, done from the Supabase
-- dashboard or a migration using the service_role key — never from the client.
-- Re-granting write access means adding an insert/update/delete policy back
-- here, which reintroduces the exposure described above.
