import { HugeiconsIcon } from '@hugeicons/react'
import { Book04Icon } from '@hugeicons/core-free-icons'
import Button from '../ui/Button'
import { getCompanyTone } from '../../lib/companyTones'
import Spinner from '../ui/Spinner';

export default function CompanyCard({ company, questionCount = null, isStatsLoading = false }) {
  const { name, fullName, description, slug, monogram } = company;

  // Plain surface, matching TopicCard directly above in the page. The card was
  // previously tinted per company, which made two structurally identical
  // adjacent card grids look like different components. The monogram chip is
  // the only per-company colour now.
  const isComingSoon = questionCount === 0;
  const showQuestionCount = !isComingSoon && (isStatsLoading || questionCount !== null);

  return (
    <article className="motion-card group flex h-full flex-col rounded-xl border border-[#EAEAEA] bg-white p-6 dark:border-border dark:bg-surface">
      {/* Monogram, not the company name. "Cognizant" and "LTIMindtree" could
          never fit legibly in a 56px badge; the mark is now always <= 4 chars.
          Tracking is POSITIVE: this is 14px uppercase, and the inverse-of-size
          rule asks for looser tracking on small text, not tighter. */}
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-sm font-bold uppercase tracking-[0.06em] ${getCompanyTone(company.color).monogram}`}
        aria-hidden="true"
      >
        {monogram ?? name.slice(0, 3).toUpperCase()}
      </div>

      {/* Title — 20px/600, matching TopicCard. Was 20px/700, which read
          heavier than the neighbouring 24px/600 topic titles. */}
      <h3 className="text-xl font-semibold leading-snug tracking-[-0.01em] text-text-strong">
        {name}
      </h3>

      {/* Only present where it expands an acronym (TCS, HCL). For Cognizant,
          Infosys and Wipro it was just the name plus a legal suffix. */}
      {fullName && (
        <p className="mt-1 text-sm leading-snug text-text-muted">{fullName}</p>
      )}

      {/* min-h matches TopicCard: exactly three lines at 16px x 1.6. The old
          4.5rem reserved less than the clamp actually occupied. */}
      <p className="mt-2 min-h-[4.8rem] text-base leading-[1.6] text-text line-clamp-3">
        {description}
      </p>

      <div className="mt-auto pt-5">
        {showQuestionCount && (
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-text-muted">
            <HugeiconsIcon
              icon={Book04Icon}
              className="h-4 w-4 text-accent-ink"
              aria-hidden="true"
            />
            {isStatsLoading ? <Spinner size="sm" /> : `${questionCount} questions`}
          </p>
        )}

        {isComingSoon ? (
          /* A single "Coming Soon" signal. It used to appear twice — as an
             absolutely-positioned badge that could also collide with the
             monogram on a narrow card, and again on the disabled button. */
          <Button
            disabled
            showArrow={false}
            className="w-full cursor-not-allowed bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400"
          >
            Coming Soon
          </Button>
        ) : (
          <Button to={`/practice/company/${slug}`} size="sm" className="w-full">
            Start Practice
            <span className="sr-only"> — {name}</span>
          </Button>
        )}
      </div>
    </article>
  );
}
