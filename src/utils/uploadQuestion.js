import supabase from "../lib/supabase";
import questionsBySlug from "../data/questions";

export const uploadQuestions = async () => {
  // Check if already uploaded
  const { data: existing } = await supabase.from('questions').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Questions already uploaded, skipping...');
    return;
  }

  // Flatten all question arrays into one
  const allQuestions = Object.values(questionsBySlug).flat();

  // Map camelCase to snake_case for Supabase
  const mappedQuestions = allQuestions.map(q => ({
    topic_slug: q.subcategory || q.topicSlug,
    category: q.category || 'quant',
    subcategory: q.subcategory,
    level: q.level,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation
  }));

  console.log("Total questions:", mappedQuestions.length);
  console.log("Topic slugs:", [...new Set(mappedQuestions.map(q => q.topic_slug))]);

  // Insert new questions
  const { data, error } = await supabase
    .from("questions")
    .insert(mappedQuestions);

  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Questions uploaded successfully:", data);
  }
};
