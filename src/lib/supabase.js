
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log(import.meta.env.VITE_SUPABASE_URL )
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

const SUBCATEGORY_ALIASES = {
  percentages: ['percentages', 'percentage'],
  percentage: ['percentages', 'percentage'],
};

const getSubcategoryAliases = (slug) =>
  SUBCATEGORY_ALIASES[normalizeValue(slug)] || [slug];

// Load the small fields needed for every displayed statistic. Pagination keeps
// category/company totals correct even when Supabase's row limit is reached.
export const getQuestionStatistics = async (categorySlugs, companyNames) => {
  const pageSize = 1000;
  const questions = [];
  let total = 0;

  for (let from = 0; ; from += pageSize) {
    const { data, error, count } = await supabase
      .from('questions')
      .select('category, company', { count: 'exact' })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (from === 0) total = count || 0;
    questions.push(...(data || []));
    if (!data?.length || questions.length >= total) break;
  }

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

// Fetch only rows belonging to the selected category and its declared subcategory.
// The aliases preserve the category values already used by the questions table;
// subcategories still come exclusively from the predefined UI taxonomy.
export const getQuestionsBySlug = async (categorySlug, subcategorySlug) => {
  const subcategoryAliases = getSubcategoryAliases(subcategorySlug);
  const { data, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .in('subcategory', subcategoryAliases)
    .order('id')

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  const allowedCategories = new Set(
    (CATEGORY_ALIASES[categorySlug] || [categorySlug]).map(normalizeValue)
  );

  return (data || []).filter(question =>
    allowedCategories.has(normalizeValue(question.category))
  )
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

// Get question count by slug
export const getQuestionCountBySlug = async (slug) => {
  const aliases = getSubcategoryAliases(slug);
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .or(`topic_slug.in.(${aliases.join(',')}),subcategory.in.(${aliases.join(',')})`)

  if (error) {
    console.error('Error getting question count:', error)
    return 0
  }

  return count || 0
}

// Get all question counts grouped by topic
export const getAllQuestionCounts = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('topic_slug, subcategory')

  if (error) {
    console.error('Error getting all question counts:', error)
    return {}
  }

  const counts = {};
  data.forEach(q => {
    const slug = q.subcategory || q.topic_slug;
    if (slug) {
      // Add with original slug
      counts[slug] = (counts[slug] || 0) + 1;
      // Also add with 's' variant for compatibility
      if (slug === 'percentage') counts['percentages'] = counts[slug];
      if (slug === 'simple-interest') counts['simple-interests'] = counts[slug];
    }
  });

  return counts
}

export default supabase
