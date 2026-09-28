import { Link } from 'react-router-dom';
import ArrowRight from '../../icons/ArrowRight';

// Note: do not add a `pointer-events` utility to the disabled state here. It
// suppresses the not-allowed cursor that callers pass in, leaving the desktop
// cursor to show whatever sits behind the button. A real <button disabled>
// already ignores clicks, so the utility buys nothing.
const BASE_CLASSES =
  'press inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// `text-accent-contrast` (#17210a) on the lime-400 fill is 11.07:1. The old
// `text-white` pairing was 1.51:1 — the primary CTA was effectively unreadable.
//
// Every variant carries the button depth treatment: a 1px inset ring to define
// the control's edge against any fill, and a text shadow so the label keeps its
// own contrast instead of flattening into the background. The ring is light on
// the saturated fill and dark on the light ones — a white hairline on a white
// button is invisible, and a black one on lime reads as dirt.
const VARIANTS = {
  primary:
    'bg-lime-400 text-accent-contrast hover:bg-lime-300 shadow-lg shadow-lime-500/25 ' +
    'inset-ring-1 inset-ring-white/30 text-shadow-2xs',
  secondary:
    'bg-transparent text-accent-ink border border-accent-ink/40 hover:bg-accent-ink/10 hover:border-accent-ink ' +
    'inset-ring-1 inset-ring-black/10 text-shadow-xs',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-text dark:hover:bg-surface-2 ' +
    'text-shadow-xs',
};

const SIZES = {
  md: 'px-8 py-4',
  sm: 'px-6 py-3',
};

/**
 * Renders a real <Link> when `to` is set, otherwise a <button>. Callers must
 * not wrap this in a <Link> — nesting interactive elements breaks keyboard
 * and screen-reader semantics.
 */
const Button = ({
  to,
  onClick,
  type = 'button',
  children,
  text,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  ...rest
}) => {
  const classes = [
    BASE_CLASSES,
    SIZES[size] ?? SIZES.md,
    VARIANTS[variant] ?? VARIANTS.primary,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children ?? text}
      {showArrow && <ArrowRight className="h-5 w-5 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default Button;
