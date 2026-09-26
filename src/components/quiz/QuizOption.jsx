const LABELS = ['A', 'B', 'C', 'D'];

export default function QuizOption({ index, text, selected, onSelect, state = 'default', disabled = false }) {
  // state can be: 'default', 'correct', 'wrong'
  let borderColor = 'border-border';
  let bgColor = 'bg-surface';
  let textColor = 'text-text';
  let badgeBorderColor = 'border-border';
  let badgeTextColor = 'text-text';
  let hoverClass = 'hover:border-[#c3c3c3] dark:hover:border-[#3a465b] hover:bg-surface-2';

  if (state === 'correct') {
    borderColor = 'border-[#86efac] dark:border-green-400/60';
    bgColor = 'bg-[#f0fdf4] dark:bg-green-950/40';
    textColor = 'text-primary-strong dark:text-green-300';
    badgeBorderColor = 'border-[#86efac] dark:border-green-400/60';
    badgeTextColor = 'text-primary-strong dark:text-green-300';
    hoverClass = '';
  } else if (state === 'wrong') {
    borderColor = 'border-[#fca5a5] dark:border-red-400/60';
    bgColor = 'bg-[#fef2f2] dark:bg-red-950/40';
    // #b91c1c, not #dc2626: on the #fef2f2 wrong-state fill #dc2626 is only
    // 4.41:1, under the 4.5 floor for this label size. The badge keeps #dc2626
    // because it sits on bg-white where that is 4.83:1.
    textColor = 'text-[#b91c1c] dark:text-red-300';
    badgeBorderColor = 'border-[#fca5a5] dark:border-red-400/60';
    badgeTextColor = 'text-[#dc2626] dark:text-red-300';
    hoverClass = '';
  } else if (selected) {
    borderColor = 'border-[#86efac] dark:border-green-400/60';
    bgColor = 'bg-[#f0fdf4] dark:bg-green-950/40';
    textColor = 'text-primary-strong dark:text-green-300';
    badgeBorderColor = 'border-[#86efac] dark:border-green-400/60';
    badgeTextColor = 'text-primary-strong dark:text-green-300';
    hoverClass = '';
  }

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 border-[1.5px] border-dashed rounded-xl cursor-pointer text-left t-interactive active:scale-[0.99] ${borderColor} ${bgColor} ${textColor} ${!disabled ? hoverClass : 'opacity-60 cursor-not-allowed'}`}
    >
      {/* Letter badge */}
      <span
        className={`shrink-0 w-7 h-7 rounded-full border-[1.5px] bg-white dark:bg-surface flex items-center justify-center text-xs font-semibold t-interactive ${badgeBorderColor} ${badgeTextColor}`}
      >
        {LABELS[index]}
      </span>

      {/* Answer text */}
      <span className="flex-1 text-[0.9375rem] font-normal text-text-strong leading-snug">
        {text}
      </span>

      {/* Keyboard shortcut number */}
      <span
        className={`shrink-0 w-[22px] h-[22px] rounded-[0.3rem] border bg-white dark:bg-surface flex items-center justify-center text-[0.7rem] font-semibold t-interactive ${badgeBorderColor} ${badgeTextColor}`}
      >
        {index + 1}
      </span>
    </button>
  );
}
