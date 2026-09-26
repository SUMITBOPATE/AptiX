/**
 * The single loading indicator used across the app.
 *
 * One idiom everywhere rather than a spinner on some routes and a shimmer on
 * others — a rotating arc reads as "working" without needing a word of
 * explanation, and it stays put instead of reflowing the row it sits in.
 *
 * Always `aria-hidden`: announcing four spinners on the landing page would be
 * noise, and the counts they stand in for are supplementary to the card content.
 * Page-level loads get their announcement from <LoadingState> instead.
 */
export default function Spinner({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const strokeWidth = isSm ? 3 : 2.5;

  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`loading-spinner ${isSm ? 'h-3.5 w-3.5' : 'h-7 w-7'} text-accent-ink`}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border opacity-40"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
