import { HugeiconsIcon } from '@hugeicons/react'
import {ArrowRight01Icon} from '@hugeicons/core-free-icons';
import { PercentCircleIcon, MoneyBag02Icon, BankIcon, Time02Icon, BalanceScaleIcon } from '@hugeicons/core-free-icons';

const iconMap = {
  'percentages': PercentCircleIcon,
  'profit-loss': MoneyBag02Icon,
  'simple-interest': BankIcon,
  'time-work': Time02Icon,
  'ratios-proportions': BalanceScaleIcon,
  'series-completion': null,
  'coding-decoding': null,
  'blood-relations': null,
  'direction-sense': null,
  'logical-puzzles': null,
  'synonyms-antonyms': null,
  'sentence-correction': null,
  'reading-comprehension': null,
  'fill-in-blanks': null,
  'para-jumbles': null,
  'full-mock-tests': null,
};

const SubtopicCard = ({ subtopic, onClick, questionCount = 0 }) => {
  const { name, slug, description } = subtopic;
  const totalQuestions = questionCount;
  const IconComponent = iconMap[slug];

  return (
    <div >
      <div
        key={slug}
        onClick={onClick}
        className="group relative bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-border p-4 cursor-pointer overflow-hidden hover:bg-gray-50 dark:hover:bg-surface-2 transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-400/10 dark:to-lime-400/10 dark:border dark:border-lime-400/10 rounded-4xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
            {IconComponent ? (
              <HugeiconsIcon icon={IconComponent} className="w-6 h-6 text-lime-400" />
            ) : (
              subtopic.icon
            )}
          </div>

          <div className="flex-1 min-w-0 relative">
            <h3 className="text-base font-semibold text-gray-900 leading-tight truncate pr-12">
              {name}
            </h3>
            <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-4xl bg-lime-200 dark:bg-lime-400/15 dark:text-lime-300 dark:border dark:border-lime-400/10 text-xs font-medium text-gray-600">
              0/{totalQuestions}
            </span>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
              {description}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-lime-50 dark:group-hover:bg-lime-400/10 transition-colors">
         <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-gray-400 group-hover:text-lime-600 transition-colors" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-indigo-50/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
      </div>
    </div>
  );
};

export default SubtopicCard;
