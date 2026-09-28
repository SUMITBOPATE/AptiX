// Answer normalisation, shared by every quiz surface.
//
// Company and topic questions are imported from different sources, so
// `correct_answer` is stored either as an option letter ("A", "Option B") or as
// the option text itself ("20%", "Temporary"). Both resolve to option text here
// so a single comparison scores every question correctly.

export const getQuestionOptions = (question) => [
  question?.option_a,
  question?.option_b,
  question?.option_c,
  question?.option_d,
];

export const normalizeAnswer = (value) => `${value ?? ''}`.trim().toLowerCase();

export const getCorrectOptionText = (question) => {
  const options = getQuestionOptions(question);
  const rawAnswer = `${question?.correct_answer ?? question?.correctAnswer ?? ''}`.trim();
  const letterMatch = rawAnswer.match(/^(?:option\s*)?([a-d])(?:[.)])?$/i);

  if (letterMatch) return options[letterMatch[1].toUpperCase().charCodeAt(0) - 65];

  return options.find(option => normalizeAnswer(option) === normalizeAnswer(rawAnswer));
};

export const isCorrectOption = (option, question) =>
  normalizeAnswer(option) === normalizeAnswer(getCorrectOptionText(question));
