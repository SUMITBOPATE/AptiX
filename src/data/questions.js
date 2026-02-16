// Import all question files
import { percentageQuestions } from './quant.js/percentage.js';
import { profitLossQuestions } from './quant.js/profitLoss.js';
import { ratioProportionQuestions } from './quant.js/ratioProportion.js';
import { simpleInterestQuestions } from './quant.js/simpleInterest.js';
import { timeWorkQuestions } from './quant.js/timeWork.js';

// Map slugs to question arrays
const questionsBySlug = {
  'percentages': percentageQuestions,
  'profit-loss': profitLossQuestions,
  'ratio-proportion': ratioProportionQuestions,
  'simple-interest': simpleInterestQuestions,
  'time-work': timeWorkQuestions,
};

// Get all questions for a subtopic
export function getQuestionsBySlug(slug) {
  return questionsBySlug[slug] || [];
}

// Get question counts by difficulty
export function getQuestionCounts(slug) {
  const questions = getQuestionsBySlug(slug);
  const counts = { easy: 0, medium: 0, hard: 0 };

  questions.forEach(q => {
    if (q.level === 'easy') counts.easy++;
    else if (q.level === 'medium') counts.medium++;
    else if (q.level === 'hard') counts.hard++;
  });

  return counts;
}

// Get questions filtered by difficulty
export function getQuestionsByDifficulty(slug, difficulty) {
  const questions = getQuestionsBySlug(slug);

  if (difficulty === 'Adaptive AI Mode') {
    return questions;
  }

  return questions.filter(q => q.level === difficulty);
}
