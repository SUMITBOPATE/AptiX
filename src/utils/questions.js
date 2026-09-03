const normalizeQuestionText = (value) => `${value ?? ''}`
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

// Database imports can create separate rows for the same question. Use the
// normalized question text as the set identity so only one copy is presented.
export const getUniqueQuestions = (questions = []) => {
  const seen = new Set();

  return questions.filter((question) => {
    const normalizedText = normalizeQuestionText(question?.question);
    const key = normalizedText || `id:${question?.id}`;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
