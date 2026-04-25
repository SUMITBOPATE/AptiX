
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Get questions by topic slug (checks both topic_slug and subcategory)
export const getQuestionsBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .or(`topic_slug.eq.${slug},subcategory.eq.${slug}`)
    .order('id')

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return data || []
}

// Get question count by slug
export const getQuestionCountBySlug = async (slug) => {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .or(`topic_slug.eq.${slug},subcategory.eq.${slug}`)

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
