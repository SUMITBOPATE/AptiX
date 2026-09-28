import ArrowLeft from '../../icons/ArrowLeft';
import ArrowRight from '../../icons/ArrowRight';

/**
 * Previous / progress / Next-or-Finish bar. Was duplicated verbatim across the
 * topic quiz and the company quiz.
 */
export default function QuizNav({ currentIndex, total, isLastQuestion, canAdvance, onPrev, onNext, onFinish }) {
  return (
    <footer className="theme-quiz-footer border-t border-dashed border-gray-200 dark:border-white/[0.05] bg-gray-50 px-4 sm:px-6 py-3">
      <div className="max-w-[700px] mx-auto flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-text-strong hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive text-shadow-xs hover:inset-ring-1 hover:inset-ring-black/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-text-muted tabular-nums">
          {currentIndex + 1} / {total}
        </span>

        {isLastQuestion ? (
          <button
            onClick={onFinish}
            disabled={!canAdvance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-accent-contrast bg-lime-400 hover:bg-lime-300 disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive inset-ring-1 inset-ring-white/30 text-shadow-2xs"
          >
            Finish
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-accent-ink hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive text-shadow-xs hover:inset-ring-1 hover:inset-ring-black/10"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </footer>
  );
}
