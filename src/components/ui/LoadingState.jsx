import Spinner from './Spinner';

/**
 * Page-level loading state.
 *
 * The label is visually hidden by default — the spinner already says "working",
 * and a line of "Loading questions..." under it is noise that reflows the page.
 * It stays in the accessibility tree as a polite live region, and becomes
 * visible under prefers-reduced-motion, where the spinner stops moving and
 * something static has to carry the meaning.
 */
export default function LoadingState({ label = 'Loading', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Spinner />
      <span className="text-sm font-medium text-text-muted sr-only motion-reduce:not-sr-only">
        {label}
      </span>
    </div>
  );
}
