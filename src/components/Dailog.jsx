import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Leaf01Icon, FlashIcon, Fire02Icon, StarsIcon } from '@hugeicons/core-free-icons';

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',        icon: Leaf01Icon, desc: 'Foundational concepts' },
  { id: 'medium', label: 'Medium',      icon: FlashIcon, desc: 'Word problems & logic' },
  { id: 'hard',   label: 'Hard',        icon: Fire02Icon, desc: 'Advanced & complex' },
  { id: 'ai',     label: 'AI Adaptive', icon: StarsIcon, desc: 'Smart difficulty tuning', recommended: true },
];

const SLIDER_STEPS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

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

function getEstimatedTime(subtopic, difficulty, count) {
  if (!subtopic?.estimatedTime || !subtopic.estimatedTime[difficulty]) return `~${count} min`;
  return subtopic.estimatedTime[difficulty];
}

export default function Dialog({ onClose, selectedSubtopic, onStart }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const config = { subtopic: selectedSubtopic, selectedDifficulty, count: questionCount };
  const sliderPercent = ((questionCount - 5) / (50 - 5)) * 100;
  const estimatedTime = getEstimatedTime(selectedSubtopic, selectedDifficulty, questionCount);

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-card overflow-hidden flex flex-col border border-border">

        {/* Dashed lime accent rail — gradient, kept as CSS class */}
        <div   />

        {/* Header */}
        <div className="flex items-start bg-gray-50 gap-2.5 px-4 pt-4 pb-3 border-b border-dashed border-border relative">
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
            className="bg-transparent border border-border rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-surface hover:border-[#c3c3c3] transition-all shrink-0 mt-0.5"
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
              <span
                className="text-sm font-bold text-primary-strong border border-dashed border-primary rounded-md px-2 py-0.5 min-w-8 text-center"
                style={{ background: 'oklch(95% 0.06 130)' }}
              >
                {questionCount}
              </span>
            </div>

            {/* Slider with custom track */}
            <div className="relative pt-2 pb-1">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[5px] bg-surface-2 rounded-full pointer-events-none -mt-[3px]">
                <div className="h-full bg-primary rounded-full transition-[width_0.1s]" style={{ width: `${sliderPercent}%` }} />
              </div>
              {/* dialog-slider keeps only the thumb pseudo-element CSS */}
              <input
                type="range"
                min="5" max="50" step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="dialog-slider relative w-full h-5 appearance-none bg-transparent cursor-pointer z-[2]"
              />
              {/* Tick marks */}
              <div className="flex justify-between px-0.5 mt-1 pointer-events-none">
                {SLIDER_STEPS.map((step) => (
                  <span
                    key={step}
                    className={`w-1 h-1 rounded-full transition-colors ${step <= questionCount ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[0.6875rem] text-text-muted">
              <span>5</span><span>50</span>
            </div>
          </div>

          {/* Estimated time highlight */}
          <div
            className="flex items-center gap-3 border-[1.5px] border-dashed border-primary rounded-xl px-3.5 py-2.5"
            style={{ background: 'oklch(97% 0.04 130)' }}
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
              <ClockIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.6875rem] text-text-muted font-medium uppercase tracking-[0.04em]">Estimated Time</span>
              <span className="text-[0.9375rem] font-bold text-primary-strong">{estimatedTime}</span>
            </div>
            <div className="w-px h-7 bg-primary opacity-25 mx-auto" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.6875rem] text-text-muted font-medium uppercase tracking-[0.04em]">Questions</span>
              <span className="text-[0.9375rem] font-bold text-primary-strong">{questionCount} Q</span>
            </div>
          </div>

          {/* Difficulty */}
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
                    className={`relative flex flex-col items-start gap-[0.05rem] px-3 py-2 border-[1.5px] border-dashed rounded-xl cursor-pointer text-left transition-all active:scale-[0.98] ${
                      active
                        ? 'border-primary'
                        : 'border-border bg-surface hover:border-[#c3c3c3] hover:bg-surface-2'
                    }`}
                    style={active ? { background: 'oklch(96% 0.06 130)' } : {}}
                  >
                    {diff.recommended && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tracking-[0.04em] whitespace-nowrap">
                        Recommended
                      </span>
                    )}
                    <HugeiconsIcon icon={diff.icon} className="w-3 h-3" />
                    <span className="text-[0.8125rem] font-semibold text-text-strong leading-snug">{diff.label}</span>
                    <span className="text-[0.6875rem] text-text-muted leading-snug">{diff.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 py-3 border-t border-dashed border-border bg-surface">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-center transition-all active:scale-[0.97] bg-white text-text border-[1.5px] border-border hover:bg-surface-2"
          >
            Exit
          </button>
          <button
            onClick={() => onStart(config)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-center transition-all active:scale-[0.97] bg-primary text-white border-none hover:bg-primary-soft"
          >
            Start Practice →
          </button>
        </div>

      </div>
    </div>
  );
}
