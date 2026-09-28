import QuizOption from './QuizOption';
import { COPY } from '../../lib/copy';
import { getCorrectOptionText, isCorrectOption } from '../../lib/answers';

/**
 * The question card: the question itself, its options, the answer feedback and
 * the explanation. Previously duplicated across the topic quiz and the company
 * quiz, where the two copies had already drifted apart in four places.
 *
 * `revealFeedback` is false in mock-test mode, where an answer is locked in
 * immediately and must not be marked right or wrong mid-run.
 */
export default function QuizQuestion({
  question,
  currentIndex,
  total,
  metaLabels = [],
  selectedAnswer,
  attemptedOptions = [],
  isResolved = false,
  showAnswer = false,
  revealFeedback = true,
  showAnswerHint = false,
  onSelect,
  onShowAnswer,
  explanation,
  showExplanation = false,
  onToggleExplanation,
}) {
  const selectedIsCorrect =
    revealFeedback && selectedAnswer !== undefined && isCorrectOption(selectedAnswer, question);

  return (
    <div className="w-full min-h-[350px] sm:min-h-[400px] max-w-[700px] bg-white dark:bg-surface border-1 border-dashed border-gray-200 dark:border-border p-4 sm:p-6 flex flex-col gap-3">
      {/* Subtopic & difficulty. The quiz header collapses on small screens, so
          the labels move down here rather than disappearing. */}
      {metaLabels.length > 0 && (
        <div className="flex items-center gap-2 sm:hidden">
          {metaLabels.filter(Boolean).map((label, index) => (
            <span key={label} className={index === 0 ? 'text-xs font-medium text-text-muted' : 'text-xs font-medium text-text-muted capitalize'}>
              {index > 0 && <span className="text-gray-300 mr-2">•</span>}
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs font-bold tracking-[0.08em] text-text-muted uppercase m-0">
        QUESTION {currentIndex + 1} OF {total}
      </p>

      <p className="text-base font-medium text-text-strong leading-relaxed m-0">
        {question.question}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        {[question.option_a, question.option_b, question.option_c, question.option_d].map((option, i) => {
          const isCorrect = isCorrectOption(option, question);
          const isAttempted = attemptedOptions.includes(option);
          const isSelected = selectedAnswer === option;
          let optionState = 'default';

          if (revealFeedback) {
            if (isSelected && isCorrect) {
              optionState = 'correct';
            } else if (isAttempted && !isCorrect) {
              optionState = 'wrong';
            } else if (showAnswer && isCorrect) {
              optionState = 'correct';
            }
          }

          return (
            <QuizOption
              key={i}
              index={i}
              text={option}
              selected={isSelected}
              state={optionState}
              disabled={revealFeedback ? isResolved && !isCorrect : isResolved}
              onSelect={() => onSelect(option)}
            />
          );
        })}
      </div>

      {/* Feedback and Show Answer */}
      <div className="space-y-2 mt-2">
        {revealFeedback && selectedAnswer !== undefined && (
          <div
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              selectedIsCorrect
                ? 'bg-[#f0fdf4] dark:bg-green-500/10 text-primary-strong dark:text-green-300 border border-[#bbf7d0] dark:border-green-500/40'
                : 'bg-[#fff5f5] dark:bg-red-500/10 text-danger dark:text-red-300 border border-[#fecaca] dark:border-red-500/40'
            }`}
          >
            {selectedIsCorrect ? COPY.correct : COPY.incorrect(getCorrectOptionText(question))}
          </div>
        )}

        {revealFeedback && !isResolved && (
          <div className="relative">
            {showAnswerHint && (
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              >
                Please click one option above first
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
            <button
              onClick={onShowAnswer}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-dashed border-text-muted text-text-muted hover:bg-surface-2 t-interactive inset-ring-1 inset-ring-black/10 text-shadow-xs"
            >
              {COPY.showAnswer}
            </button>
          </div>
        )}

        {/* Explanation */}
        {explanation && selectedAnswer !== undefined && (
          <div>
            <button
              onClick={onToggleExplanation}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition text-shadow-xs"
            >
              <span>📖 {COPY.explanation}</span>
              <span className={`transform transition-transform ${showExplanation ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showExplanation && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                {explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
