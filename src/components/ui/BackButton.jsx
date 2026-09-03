import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

export default function BackButton({ onClick, label = 'Back', compact = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border-0 bg-transparent p-0 text-sm font-semibold text-text-strong shadow-none active:scale-[0.98] ${className}`}
      aria-label={label}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-text-muted transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-primary-strong">
        <HugeiconsIcon icon={ArrowLeft02Icon} className="h-3.5 w-3.5" />
      </span>
      <span className={compact ? 'hidden sm:inline' : ''}>{label}</span>
    </button>
  );
}
