import Button from '../ui/Button';
import { HugeiconsIcon } from '@hugeicons/react'
import {Book04Icon,HelpCircleIcon} from '@hugeicons/core-free-icons';
import Spinner from '../ui/Spinner';

export default function TopicCard({ topic, questionCount = null, isStatsLoading = false }) {
  const { title, details, description, slug } = topic;
  const hasQuestionCount = isStatsLoading || questionCount !== null;

  return (
    <article className="motion-card group flex h-full flex-col rounded-xl border border-[#EAEAEA] bg-white p-6 dark:border-border dark:bg-surface">
      {/* Title — 20px/600, matching CompanyCard. It was 24px/600 here against
          20px/700 there, so the company cards read as the louder of two
          adjacent grids. Hierarchy is weight + size + leading as a set, and
          600 at this size carries the title without shouting over the body. */}
      <h3 className="text-xl font-semibold leading-snug tracking-[-0.01em] text-text-strong">
        {title}
      </h3>

      {/* min-h reserves exactly three lines at 16px x 1.6 (3 x 25.6 = 76.8px =
          4.8rem) so the stat row aligns across the grid. It was absent here, so
          cards with a one-line description pushed their stats out of line, and
          CompanyCard reserved 4.5rem against a clamp that actually occupies
          4.875rem — the two disagreed. */}
      <p className="mt-2 min-h-[4.8rem] text-base leading-[1.6] text-text line-clamp-3">
        {description}
      </p>

      {/* Stats */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Book04Icon}
            className="w-4 h-4 text-accent-ink"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-text-strong">{details}</span>
        </div>

        {/* Omit the stat entirely when the count is unavailable, rather than
            leaving a permanent "Loading…" on screen. */}
        {hasQuestionCount && (
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={HelpCircleIcon}
              className="w-4 h-4 text-accent-ink"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-text-strong">
              {isStatsLoading ? (
                /* Sized to the widest realistic value ("128 Questions") so the
                   number that replaces it does not reflow the row. */
                <Spinner size="sm" />
              ) : (
                <>
                  {questionCount} Questions
                  <span className="sr-only"> in {title}</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* CTA — the link IS the button, so there is exactly one interactive
          element per card and the accessible name carries the topic. */}
      <div className="mt-auto pt-6">
        <Button to={`/practice/${slug}`} className="w-full">
          Start Learning
          <span className="sr-only"> — {title}</span>
        </Button>
      </div>
    </article>
  );
}
