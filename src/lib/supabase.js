import { createClient } from '@supabase/supabase-js';
import { getUniqueQuestions } from '../utils/questions.js';
import { buildSubtopicCards } from './subtopics.js';

/*
 * DATA-ACCESS LAYER
 *
 * Rule for this file: the database filters, sorts, counts and limits. React
 * receives only the rows a screen actually needs.
 *
 * Bad  : download 10,000 rows -> filter in JS -> slice(0, 20) -> show 20
 * Good : ask for 20 rows that already match -> show 20
 *
 * The supabase client talks to PostgREST, which turns each chained method into
 * an HTTP query parameter. `.eq('company', 'TCS')` becomes `?company=eq.TCS`,
 * `.in('category', ['a','b'])` becomes `?category=in.(a,b)`. Every method returns
 * a new object, which is why they can be chained, and why a filter added after
 * `.limit()` still applies to the database query rather than to JS.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

/*
 * COLUMN LISTS
 *
 * Asking for named columns instead of '*' means Postgres only reads and sends
 * those columns, which is much cheaper on a wide table.
 *
 * These lists only contain columns confirmed to exist: `database/sampleQuestions.sql`
 * inserts them, and the current queries already filter on them. Two other column
 * names appear in the old JavaScript (`difficulty` and `correctAnswer`) but
 * cannot be verified from the repo, and a `select()` naming a column that does
 * not exist is a hard Postgres error. They are therefore still read defensively
 * in JavaScript, and `database/optimizeIndexes.sql` includes a migration that
 * normalises them so the projection can be tightened later.
 */

// Only used for the subtopic index: three text columns plus `id` for pagination.
const INDEX_COLUMNS = 'id, category, subcategory, topic_slug';

// The questions table stores the same category under several spellings, so a
// canonical slug has to expand to every value the database may hold.
const CATEGORY_ALIASES = {
  'quantitative-aptitude': ['quantitative-aptitude', 'quantitative', 'quant'],
  'logical-reasoning': ['logical-reasoning', 'logical reasoning', 'reasoning'],
  'verbal-ability': ['verbal-ability', 'verbal ability', 'verbal reasoning', 'verbal'],
};

const normalizeValue = (value) => `${value || ''}`.toLowerCase().trim();

/** Every database spelling that belongs to one canonical category slug. */
export const getCategoryAliases = (categorySlug) =>
  (CATEGORY_ALIASES[categorySlug] || [categorySlug]).map(normalizeValue);

/**
 * Builds the `in.(...)` fragment that PostgREST expects.
 * Values are double-quoted so a subcategory containing a comma, a space or a
 * bracket (`Ratio & Proportion, part 1`) cannot break the query.
 */
const toInList = (values) =>
  `(${values.map((value) => `"${String(value).replace(/"/g, '\\"')}"`).join(',')})`;

/**
 * Applies the shared filters to a query. Called by every read function so the
 * filtering rules live in exactly one place.
 *
 * Each filter is skipped when its argument is absent, so one function can serve
 * a subtopic quiz, a company quiz and a category count.
 */
const applyFilters = (query, { category, subcategory, topicSlug, company } = {}) => {
  let next = query;

  if (category) {
    // category is a canonical slug; expand it to every spelling in the database.
    next = next.in('category', getCategoryAliases(category));
  }
  if (subcategory?.length) next = next.in('subcategory', subcategory);
  if (topicSlug?.length) next = next.in('topic_slug', topicSlug);
  if (company) next = next.eq('company', company);

  return next;
};

/**
 * Every function in this file throws on a database error, and the React layer
 * decides what the visitor sees. Swallowing the error and returning [] would be
 * worse: an empty array is indistinguishable from "there is genuinely no data",
 * so a network failure would be displayed to the user as a confident statement
 * about the question bank.
 *
 * The raw Supabase message can name tables and constraints, so it is logged for
 * developers and never rendered. `import.meta.env.DEV` is replaced at build time,
 * which is why it costs nothing in production.
 */
const throwOnError = (error, context) => {
  if (!error) return;
  if (import.meta.env.DEV) {
    console.error(`[supabase] ${context}:`, error.message ?? error);
  }
  throw new Error(`Could not load ${context}. Please try again.`);
};

/* ------------------------------------------------------------------------- *
 * COUNTING
 * ------------------------------------------------------------------------- */

/**
 * Counts matching questions without transferring a single row.
 *
 * `head: true` tells PostgREST to return only the `Content-Range` header and no
 * body, so the database does the `COUNT(*)` and the browser receives nothing.
 * That is the whole difference between this and downloading rows to count them
 * in JavaScript.
 */
export const getQuestionCount = async (filters = {}) => {
  // No `data` here on purpose: head requests return no body.
  const { error, count } = await applyFilters(
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    filters
  );

  throwOnError(error, 'question count');
  return count ?? 0;
};

/**
 * Counts for many filter sets at once, used by the homepage cards.
 *
 * Every count is an independent request, so they are started together with
 * Promise.all instead of one after another. Nothing is downloaded, so the cost
 * is a handful of empty responses rather than the whole table.
 */
export const getQuestionCounts = async (filterSets = []) => {
  const counts = await Promise.all(filterSets.map((filters) => getQuestionCount(filters)));
  return filterSets.map((filters, index) => ({ ...filters, count: counts[index] }));
};

/* ------------------------------------------------------------------------- *
 * QUESTIONS
 * ------------------------------------------------------------------------- */

/**
 * Fetches questions that already match every filter, ordered and limited by the
 * database.
 *
 * `limit` is the important part: it tells Postgres to stop after N rows instead
 * of building the whole result set and letting the browser throw most of it away.
 *
 * `select('*')` is deliberate. The questions table is wide, and naming only the
 * needed columns would be cheaper still, but two of the column names the
 * JavaScript reads cannot be verified from the repository, and a select naming a
 * missing column fails the whole query. Tighten this once the schema is checked.
 */
export const getQuestions = async ({ limit, ...filters } = {}) => {
  let query = applyFilters(supabase.from('questions').select('*'), filters).order('id');

  // `range` rather than `limit` because the quiz pages track a position and a
  // total. Same single request either way — no extra round trip.
  if (typeof limit === 'number') query = query.range(0, limit - 1);

  const { data, error } = await query;
  throwOnError(error, 'questions');
  return data || [];
};

/**
 * Mock-test questions.
 *
 * The old version ran `select('*')` with no range at all, which meant the whole
 * table was downloaded and then silently truncated to whatever the server's
 * `db-max-rows` limit happened to be (1000 by default on Supabase) — a wrong
 * question pool with no error to explain it.
 *
 * Now the database does the selection and returns only a bounded pool.
 * `order('random')` is the shuffle, in Postgres, rather than in the browser.
 *
 * The pool is larger than `count` on purpose: the caller mixes several groups
 * (each company, and quant / reasoning / verbal) round-robin so a short mock test
 * still covers every subject. That mixing needs headroom, but not the whole
 * table, so the pool is capped at a multiple of `count`.
 *
 * Cost note: `order('random')` makes Postgres sort the matching rows. That is
 * cheap at this table size and far cheaper than shipping every row, but on a very
 * large table the scalable version is a pre-shuffled `random_key` column indexed
 * and ordered on — see database/optimizeIndexes.sql.
 */
export const getMockQuestions = async ({ count = 10, poolMultiplier = 3, poolCap = 200 } = {}) => {
  const poolSize = Math.min(count * poolMultiplier, poolCap);

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('random')
    .limit(poolSize);

  throwOnError(error, 'mock questions');
  return data || [];
};

/* ------------------------------------------------------------------------- *
 * SUBTOPIC INDEX
 * ------------------------------------------------------------------------- */

/**
 * The small lookup the topic pages use to decide which card each subcategory
 * belongs to.
 *
 * The category filter moved into SQL, so this returns one category's rows
 * instead of the whole table. Three columns plus `id`, so each row is tiny.
 *
 * Pagination is kept here on purpose: this is a genuine index over the table, and
 * it must stay correct once the table outgrows one response. It is cursor
 * (keyset) pagination on `id` — `WHERE id > lastSeen` — rather than
 * `OFFSET`, because OFFSET makes the database re-scan and discard every skipped
 * row, so reading N rows in pages of 1000 costs roughly 1 + 2 + 3 … N thousand
 * row reads. Keyset costs one page per request no matter how deep you are.
 */
export const getSubcategoryIndexRows = async (categorySlug) => {
  const pageSize = 1000;
  const rows = [];
  let lastId = null;

  for (;;) {
    let query = supabase
      .from('questions')
      .select(INDEX_COLUMNS)
      .in('category', getCategoryAliases(categorySlug))
      .order('id')
      .limit(pageSize);

    if (lastId !== null) query = query.gt('id', lastId);

    const { data, error } = await query;
    throwOnError(error, 'subtopic index');

    const page = data || [];
    rows.push(...page);

    // A short page means there is nothing after it. `count` is deliberately not
    // requested: an exact count costs the database an extra COUNT(*) per page and
    // this function never reads it.
    if (page.length < pageSize) break;
    lastId = page[page.length - 1].id;
  }

  return rows;
};

/* ------------------------------------------------------------------------- *
 * QUIZ-BY-SLUG
 * ------------------------------------------------------------------------- */

/**
 * Resolves a subtopic card back to the database values that belong to it.
 * "percentage", "Percentages" and "percentage " must all serve one quiz, so the
 * alias table in subtopics.js maps them onto a single card.
 */
const getCardQueryValues = async (categorySlug, cardSlug) => {
  const rows = await getSubcategoryIndexRows(categorySlug);
  const { cards, extraCards } = buildSubtopicCards(categorySlug, rows);
  const entry = [...cards, ...extraCards].find(({ card }) => card.slug === cardSlug);

  if (!entry) return { values: [cardSlug], topicSlugs: [] };

  return {
    values: entry.values.length ? entry.values : [cardSlug],
    topicSlugs: entry.topicSlugs,
  };
};

/**
 * Questions for one subtopic card.
 *
 * The previous version made two separate queries — one for `subcategory`, one
 * for `topic_slug` — then concatenated them in JavaScript and de-duplicated.
 * A row matching both conditions was therefore fetched twice and thrown away
 * once.
 *
 * `.or()` expresses the same thing as a single SQL condition, so the database
 * returns each matching row exactly once: one request instead of three (the
 * index lookup is now scoped to one category), and no client-side de-duplication.
 */
export const getQuestionsBySlug = async (categorySlug, subcategorySlug, limit) => {
  const { values, topicSlugs } = await getCardQueryValues(categorySlug, subcategorySlug);

  // Only rows whose subcategory or topic_slug belongs to this card.
  const matches = [`subcategory.in.${toInList(values)}`];
  if (topicSlugs.length) matches.push(`topic_slug.in.${toInList(topicSlugs)}`);

  let query = supabase
    .from('questions')
    .select('*')
    .in('category', getCategoryAliases(categorySlug))
    .or(matches.join(','))
    .order('id');

  if (typeof limit === 'number') query = query.range(0, limit - 1);

  const { data, error } = await query;
  throwOnError(error, 'questions');

  const rows = data || [];

  // A row imported without a subcategory can arrive through topic_slug only, so
  // the normalised check is kept as a cheap safety net. It now runs over one
  // subtopic's rows instead of the whole table.
  const allowedCategories = new Set(getCategoryAliases(categorySlug));
  const matching = rows.filter((row) => allowedCategories.has(normalizeValue(row.category)));

  return getUniqueQuestions(matching);
};

export default supabase
