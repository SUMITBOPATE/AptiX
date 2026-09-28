import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Leaf01Icon, FlashIcon, Fire02Icon, StarsIcon } from '@hugeicons/core-free-icons';

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',        icon: Leaf01Icon, desc: 'Foundational concepts' },
  { id: 'medium', label: 'Medium',      icon: FlashIcon, desc: 'Word problems & logic' },
  { id: 'hard',   label: 'Hard',        icon: Fire02Icon, desc: 'Advanced & complex' },
  { id: 'adaptive',     label: 'Adaptive', icon: StarsIcon, desc: 'Smart difficulty recommendation', recommended: true },
];

/* Seconds per question, by difficulty. This replaces the per-subtopic
   `estimatedTime` strings in data/topicData.js, which were written per topic,
   never depended on how many questions the visitor actually chose, and so
   reported the same "2-3 min" for 5 questions and for 50. */
const SECONDS_PER_QUESTION = { easy: 30, medium: 60, hard: 60, all: 60 };

function ClockIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
      <line x1="12" y1="3" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" /><line x1="17" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function getEstimatedTime(difficulty, count) {
  const seconds = (SECONDS_PER_QUESTION[difficulty] ?? 60) * count;

  if (seconds < 60) return `~${seconds} sec`;

  const minutes = seconds / 60;
  return `~${Number.isInteger(minutes) ? minutes : minutes.toFixed(1)} min`;
}

export default function Dialog({ onClose, selectedSubtopic, onStart, hideDifficulty = false, totalQuestions = 50 }) {
  // In company mode the difficulty picker is hidden, so `selectedDifficulty` is
  // still the untouched 'easy' default. Passing that through meant the quiz page
  // filtered to Easy questions the visitor never asked for and could not see.
  // Send 'all' instead so hiding the control also removes the restriction.
  const isCompanyMode = hideDifficulty;

  // The top of the range is the number of questions actually available, and the
  // step is 1 so every one of them is reachable.
  //
  // This used to step in fives, which meant a subtopic holding 12 questions set
  // its maximum to 12 but the slider could only land on 5, 10 — the last two
  // were unselectable however far it was dragged. The floor was 5 as well, so a
  // subtopic with three questions had a minimum above its own supply and could
  // not be configured at all.
  const maxQuestions = Math.max(1, Number(totalQuestions) || 1);
  const minQuestions = 1;
  const stepValue = 1;

  // Five evenly spaced marks across whatever the real range turns out to be,
  // rather than a fixed list of multiples of five that no longer means anything.
  // Deduped and floored at the minimum: several subcategories hold exactly one
  // question, and rounding 1/5 down produced a mark at 0 with nothing to select.
  const sliderTicks = [
    ...new Set(Array.from({ length: 5 }, (_, i) => Math.round((maxQuestions * (i + 1)) / 5))),
  ].filter((tick) => tick >= minQuestions);

  // Default to 10, but never more than the subtopic actually has.
  const [questionCount, setQuestionCount] = useState(() => Math.min(10, maxQuestions));
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const config = { subtopic: selectedSubtopic, selectedDifficulty: isCompanyMode ? 'all' : selectedDifficulty, count: questionCount };
  // A subcategory holding a single question makes the range a single point, so
  // the percentage would divide by zero. That question is the only one on
  // offer, so the track is full.
  const sliderPercent = maxQuestions === minQuestions
    ? 100
    : ((questionCount - minQuestions) / (maxQuestions - minQuestions)) * 100;
  // With the picker hidden there is no chosen difficulty, so the middle rate is
  // the honest one to quote rather than the untouched 'easy' default.
  const estimatedTime = getEstimatedTime(isCompanyMode ? 'all' : selectedDifficulty, questionCount);

  return (
    <div className="fixed inset-0 bg-black/45 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface rounded-2xl w-full max-w-[440px] shadow-card overflow-hidden flex flex-col border border-border">

        {/* Dashed lime accent rail — gradient, kept as CSS class */}
        <div   />

        {/* Header */}
        <div className="flex items-start bg-gray-50 dark:bg-surface-2 gap-2.5 px-4 pt-4 pb-3 border-b border-dashed border-border relative">
          {/* Subtopic badge */}
          <div className="flex items-center gap-1.5 bg-surface border border-dashed border-border rounded-lg px-2 py-2 shrink-0">
            {selectedSubtopic?.icon && (
              <span className="text-[1.1rem] leading-none">{selectedSubtopic.icon}</span>
            )}
            <span className="text-[0.8125rem] font-semibold text-text-strong whitespace-nowrap">
              {selectedSubtopic?.name || 'Practice'}
            </span>
          </div>

          {/* Title */}
          <div className="flex-1">
            <h2 className="text-base font-bold text-text-strong mt-0.5 mb-0.5 leading-snug">
              Practice Settings
            </h2>
            <p className="text-xs text-text-muted m-0">Customize your drill session</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="bg-transparent border border-border rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-surface hover:border-[#c3c3c3] t-interactive shrink-0 mt-0.5 inset-ring-1 inset-ring-black/10"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-3.5">

          {/* Question count slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] font-semibold text-text tracking-[0.01em]">Questions</span>
              <span className="text-sm font-bold text-primary-strong dark:text-lime-300 border border-dashed border-primary rounded-md px-2 py-0.5 min-w-8 text-center bg-lime-50 dark:bg-lime-400/15">
                {questionCount}
              </span>
            </div>

            {/* Slider with custom track.

                The visible line and the thumb have to share one centre. The line
                used to be positioned against this padded parent while the thumb
                was centred inside the input, so the two centrelines were about
                5px apart and the dot read as sitting below the line — the
                -mt-[3px] on the line was a partial fudge for it. The input now
                sits in a `relative` box of its own with no padding, so
                `top-1/2 -translate-y-1/2` lands the line exactly on the input's
                midpoint, which is where the browser centres the thumb once the
                native runnable track is the full height of the input. See
                .dialog-slider-runnable-track in index.css. */}
            <div className="pt-2 pb-1">
              <div className="relative">
                <div className="dialog-slider-track absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-surface-2 rounded-full pointer-events-none">
                  <div className="dialog-slider-progress h-full bg-primary rounded-full transition-[width_0.1s]" style={{ width: `${sliderPercent}%` }} />
                </div>
                {/* dialog-slider keeps only the thumb pseudo-element CSS */}
                <input
                  type="range"
                  min={minQuestions} max={maxQuestions} step={stepValue}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="dialog-slider relative block w-full h-5 appearance-none bg-transparent cursor-pointer z-[2]"
                />
              </div>
              {/* Tick marks */}
              <div className="flex justify-between px-0.5 mt-1 pointer-events-none">
                {sliderTicks.map((tick) => (
                  <span
                    key={tick}
                    className={`w-1 h-1 rounded-full transition-colors ${tick <= questionCount ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs text-text-muted">
              <span>{minQuestions}</span><span>{maxQuestions}</span>
            </div>
          </div>

          {/* Estimated time highlight */}
          <div className="flex items-center gap-3 border-[1.5px] border-dashed border-primary rounded-xl px-3.5 py-2.5 bg-lime-50 dark:bg-lime-400/[0.07]">
              <div className="w-7 h-7 rounded-full bg-lime-400 text-accent-contrast flex items-center justify-center shrink-0">
              <ClockIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted font-medium uppercase tracking-[0.04em]">Estimated Time</span>
              <span className="text-[0.9375rem] font-bold text-primary-strong">{estimatedTime}</span>
            </div>
            <div className="w-px h-7 bg-primary opacity-25 mx-auto" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted font-medium uppercase tracking-[0.04em]">Questions</span>
              <span className="text-[0.9375rem] font-bold text-primary-strong">{questionCount} Q</span>
            </div>
          </div>

          {/* Difficulty - Hidden for company mode */}
          {!hideDifficulty && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-semibold text-text tracking-[0.01em]">Difficulty Level</span>
                <div className="text-text-muted"><TargetIcon /></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map((diff) => {
                  const active = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`press relative flex flex-col items-start gap-[0.05rem] px-3 py-2 border-[1.5px] border-dashed rounded-xl cursor-pointer text-left inset-ring-1 inset-ring-black/10 text-shadow-xs ${
                        active
                          ? 'border-primary dark:border-lime-400/50 bg-lime-50 dark:bg-lime-400/[0.07] inset-ring-primary/40'
                          : 'border-border bg-surface hover:border-[#c3c3c3] dark:hover:border-lime-400/20 hover:bg-surface-2'
                      }`}
                    >
                      {diff.recommended && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-lime-400 text-accent-contrast text-xs font-bold px-1.5 py-0.5 rounded-full tracking-[0.04em] whitespace-nowrap">
                          Recommended
                        </span>
                      )}
                      <HugeiconsIcon icon={diff.icon} className="w-3 h-3" />
                      <span className="text-[0.8125rem] font-semibold text-text-strong leading-snug">{diff.label}</span>
                      <span className="text-xs text-text-muted leading-snug">{diff.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 py-3 border-t border-dashed border-border bg-surface">
          <button
            onClick={onClose}
            className="press flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-center bg-white dark:bg-surface text-text border-[1.5px] border-border hover:bg-surface-2 inset-ring-1 inset-ring-black/10 text-shadow-xs"
          >
            Exit
          </button>
          <button
            onClick={() => onStart(config)}
            className="press flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-center bg-lime-400 text-accent-contrast border-none hover:bg-lime-300 inset-ring-1 inset-ring-white/30 text-shadow-2xs"
          >
            Start Practice →
          </button>
        </div>

      </div>
    </div>
  );
}
