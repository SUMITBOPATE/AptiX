
import { createClient } from '@supabase/supabase-js';
import { getUniqueQuestions } from '../utils/questions.js';
import { buildSubtopicCards } from './subtopics.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Get all categories (main topics)
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('is_category', true)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

// Get subtopics by parent slug
export const getSubtopics = async (parentSlug) => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('parent_slug', parentSlug)
    .eq('is_category', false)
    .order('name')

  if (error) {
    console.error('Error fetching subtopics:', error)
    return []
  }
  return data || []
}

// Get all topics (categories + subtopics)
export const getAllTopics = async () => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('is_category', { ascending: false })
    .order('name')

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }
  return data || []
}

const CATEGORY_ALIASES = {
  'quantitative-aptitude': ['quantitative-aptitude', 'quantitative', 'quant'],
  'logical-reasoning': ['logical-reasoning', 'logical reasoning', 'reasoning'],
  'verbal-ability': ['verbal-ability', 'verbal ability', 'verbal reasoning', 'verbal'],
};

const normalizeValue = (value) => `${value || ''}`.toLowerCase().trim();

const getCategoryAliases = (categorySlug) =>
  (CATEGORY_ALIASES[categorySlug] || [categorySlug]).map(normalizeValue);


// Load the small fields needed for every displayed statistic. Pagination keeps
// category/company totals correct even when Supabase's row limit is reached.
export const getQuestionStatistics = async (categorySlugs, companyNames) => {
  const pageSize = 1000;
  const questions = [];
  let serverCount = null;

  for (let from = 0; ; from += pageSize) {
    const { data, error, count } = await supabase
      .from('questions')
      .select('category, company', { count: 'exact' })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (from === 0) serverCount = count;
    questions.push(...(data || []));

    // Stop on a short page, never on `count`. PostgREST can return count: null
    // (RLS, cached responses, HEAD requests); the old `total = count || 0` then
    // made `questions.length >= total` true on the first pass, so the loop
    // silently returned statistics computed from only the first 1000 rows.
    if (!data?.length || data.length < pageSize) break;
  }

  // Prefer the server's count, but fall back to what we actually accumulated —
  // resolved after the loop, so the fallback sees every page rather than one.
  const total = serverCount ?? questions.length;

  const byCategory = Object.fromEntries(categorySlugs.map(slug => [slug, 0]));
  const byCompany = Object.fromEntries(companyNames.map(name => [name, 0]));

  questions.forEach(question => {
    categorySlugs.forEach(categorySlug => {
      const aliases = CATEGORY_ALIASES[categorySlug] || [categorySlug];
      if (aliases.map(normalizeValue).includes(normalizeValue(question.category))) {
        byCategory[categorySlug] += 1;
      }
    });

    const companyName = companyNames.find(
      name => normalizeValue(name) === normalizeValue(question.company)
    );
    if (companyName) byCompany[companyName] += 1;
  });

  return {
    total,
    byCategory,
    byCompany,
  }
}

// Small index of every question's category and subcategory. The topic pages use
// it to decide which card each subcategory belongs to, so it is paginated to
// stay correct once the table outgrows a single response.
export const getSubcategoryIndexRows = async (categorySlug) => {
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('category, subcategory, topic_slug', { count: 'exact' })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    rows.push(...(data || []));

    // Short-page termination, same reasoning as getQuestionStatistics above.
    // `count` is not needed here, so it is no longer requested or tracked.
    if (!data?.length || data.length < pageSize) break;
  }

  const allowedCategories = new Set(getCategoryAliases(categorySlug));
  return rows.filter(row => allowedCategories.has(normalizeValue(row.category)));
};

// Subcategory values (and topic_slug fallbacks) that belong to a card, used to
// build the questions query.
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

// Fetch the rows belonging to a subtopic card. The card slug is resolved back to
// every database value that maps to it, so "percentage" and "Percentages" are
// served by the same quiz.
export const getQuestionsBySlug = async (categorySlug, subcategorySlug) => {
  const { values, topicSlugs } = await getCardQueryValues(categorySlug, subcategorySlug);

  const fetchBy = (column, matches) =>
    supabase
      .from('questions')
      .select('*')
      .in(column, matches)
      .order('id');

  const { data, error } = await fetchBy('subcategory', values);
  const fallback = topicSlugs.length ? await fetchBy('topic_slug', topicSlugs) : { data: [] };

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  const allowedCategories = new Set(getCategoryAliases(categorySlug));
  const rows = [...(data || []), ...(fallback.data || [])];

  return getUniqueQuestions(
    rows.filter(row => allowedCategories.has(normalizeValue(row.category)))
  );
}

// Used by mock tests: questions are mixed client-side after retrieval.
export const getAllQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')

  if (error) {
    console.error('Error fetching mock-test questions:', error)
    return []
  }

  return data || []
}

export default supabase
