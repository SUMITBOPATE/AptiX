// Difficulty selection, shared by the topic quiz, the company quiz and the mock
// test so all three agree on what a difficulty means.
//
// A question states a difficulty of 'easy', 'medium' or 'hard' — or nothing at
// all, which is common: 390 of the 598 questions in the bank have no label.
//
// That gap is why this is not a plain equality filter. Filtering strictly means
// picking Hard on a subcategory with no hard questions returns nothing at all,
// and most subcategories have none. Filtering loosely — the old behaviour, which
// let any company-tagged question through regardless of its label — means the
// same question turns up under Easy, Medium and Hard, which is the bug this
// replaces.
//
// The rule here instead: a question that states a difficulty appears only under
// that difficulty. A question that states none is held back and used only to top
// up after the requested level, so the quiz is never empty and never pads ahead
// of what was actually asked for.

export const getQuestionDifficulty = (question) =>
  `${question?.difficulty ?? ''}`.trim().toLowerCase();

// The questions table has a `difficulty` column and no `level` one, so nothing
// reads a second field here.
export const isDifficultyLabelled = (question) => getQuestionDifficulty(question) !== '';

export const matchesDifficulty = (question, difficulty) => {
  const wanted = `${difficulty ?? ''}`.trim().toLowerCase();
  if (!wanted || wanted === 'all') return true;

  const level = getQuestionDifficulty(question);
  return !level || level === wanted;
};

// True only for a question explicitly labelled with the wanted level. Used where
// a preference is being expressed — "use these if there are any" — rather than a
// filter, so that an unlabelled question does not count as a match.
export const isExactlyDifficulty = (question, difficulty) =>
  getQuestionDifficulty(question) === `${difficulty ?? ''}`.trim().toLowerCase();

/**
 * Orders questions for a difficulty: the ones that actually state it first, then
 * the unlabelled ones to fill whatever is still missing, truncated to `limit`.
 */
export const selectByDifficulty = (questions, difficulty, limit) => {
  const wanted = `${difficulty ?? ''}`.trim().toLowerCase();
  if (!wanted || wanted === 'all') return questions.slice(0, limit);

  const labelled = questions.filter((question) => getQuestionDifficulty(question) === wanted);
  const unlabelled = questions.filter((question) => !isDifficultyLabelled(question));

  return [...labelled, ...unlabelled].slice(0, limit);
};
