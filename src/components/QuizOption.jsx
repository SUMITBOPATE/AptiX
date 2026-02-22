const LABELS = ['A', 'B', 'C', 'D'];

export default function QuizOption({ index, text, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 border-[1.5px] border-dashed rounded-xl cursor-pointer text-left transition-all active:scale-[0.99] ${
        selected
          ? 'border-[#86efac] bg-[#f0fdf4]'
          : 'border-border bg-surface hover:border-[#c3c3c3] hover:bg-surface-2'
      }`}
    >
      {/* Letter badge */}
      <span
        className={`shrink-0 w-7 h-7 rounded-full border-[1.5px] bg-white flex items-center justify-center text-xs font-semibold transition-all ${
          selected ? 'border-[#86efac] text-primary-strong' : 'border-border text-text'
        }`}
      >
        {LABELS[index]}
      </span>

      {/* Answer text */}
      <span className="flex-1 text-[0.9375rem] font-normal text-text-strong leading-snug">
        {text}
      </span>

      {/* Keyboard shortcut number */}
      <span
        className={`shrink-0 w-[22px] h-[22px] rounded-[0.3rem] border bg-white flex items-center justify-center text-[0.7rem] font-semibold transition-all ${
          selected ? 'border-[#86efac] text-primary-strong' : 'border-border text-text-muted'
        }`}
      >
        {index + 1}
      </span>
    </button>
  );
}
