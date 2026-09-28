import { HugeiconsIcon } from '@hugeicons/react'
import {ArrowRight01Icon} from '@hugeicons/core-free-icons';
import { getSubtopicIcon } from './subtopicIcons';
import { COPY } from '../../lib/copy';
import Spinner from '../ui/Spinner';

const SubtopicCard = ({ subtopic, onClick, questionCount = null }) => {
  const { name, slug, description } = subtopic;
  const totalQuestions = questionCount;
  const isComingSoon = totalQuestions === 0;
  const IconComponent = getSubtopicIcon(slug);


  return (
    <div >
      <div
        key={slug}
        onClick={isComingSoon ? undefined : onClick}
        aria-disabled={isComingSoon}
        className={`group relative bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-border p-4 overflow-hidden transition-shadow ${
          isComingSoon
            ? 'cursor-not-allowed opacity-75'
            : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-2'
        }`}
      >
        {isComingSoon && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            {COPY.comingSoon}
          </span>
        )}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-400/10 dark:to-lime-400/10 dark:border dark:border-lime-400/10 rounded-4xl flex items-center justify-center text-xl flex-shrink-0 hover-scale-icon">
            <HugeiconsIcon icon={IconComponent} className="w-6 h-6 text-lime-400" />
          </div>

          <div className="flex-1 min-w-0 relative">
            <h3
              /* truncate keeps the row one line high, but it hides the name —
                 and the name is the whole point of the card. title puts the
                 full string back within reach on hover and on tap. */
              title={subtopic.name}
              className={`text-base font-semibold text-gray-900 leading-tight truncate ${isComingSoon ? 'pr-24' : 'pr-28'}`}
            >
              {name}
            </h3>
            {!isComingSoon && (
              <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-4xl bg-lime-200 dark:bg-lime-400/15 dark:text-lime-300 dark:border dark:border-lime-400/10 text-xs font-medium text-gray-600">
                {/* Spinner rather than the word "Loading" — a rotating arc
                    reads as "working" without a line of text reflowing the row. */}
                {totalQuestions === null ? (
                  <Spinner size="sm" className="h-3 w-3" />
                ) : (
                  /* A plain count. This read `0/29`, and the 0 was hardcoded —
                     it looked like tracked progress the app does not have,
                     because there are no accounts and nothing is persisted. */
                  `${totalQuestions} Questions`
                )}
              </span>
            )}
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-[1.5]">
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
