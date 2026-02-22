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
  'ratio-proportions': ratioProportionQuestions,
  'simple-interest': simpleInterestQuestions,
  'time-work': timeWorkQuestions,
};

// Export function to get questions by subcategory slug
export const getQuestionsBySlug = (slug) => {
  return questionsBySlug[slug] || [];
};

export default questionsBySlug;
