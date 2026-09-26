import Button from '../components/ui/Button';
import FloatingQuizCards from '../components/home/FloatingQuizCards';

export default function Hero({ onScrollTo }) {
  return (
    <div className="max-w-screen-2xl justify-center text-gray-800 dark:text-text font-sans">
      {/* Content. No <Reveal> here on purpose: the h1 is the LCP element and
          the primary content, and hiding it until an observer fires delays the
          largest paint and leaves a blank first screen if JS is slow. */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-0 sm:pt-10">
        {/* Explicit, non-uniform vertical rhythm. The heading and its
            supporting line are one unit and sit closer together than the gap
            down to the CTA row — a uniform space-y-* flattens that hierarchy.
            All in rem, so a larger user text size scales the layout with it. */}
        <div className="max-w-5xl w-full text-center z-10">
          {/* Status chip. Small text wants slightly POSITIVE tracking (the
              inverse of the display heading), and leading-none lets the
              padding alone set the chip's height. */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium leading-none tracking-[0.01em] text-gray-600">
            <span className="h-2 w-2 rounded-full bg-accent-ink motion-safe:animate-pulse" aria-hidden="true" />
            Version 1.0 Now Live
          </div>

          {/* Heading.
              clamp() for fluid optical sizing, then leading that TIGHTENS as
              the type grows and tracking that goes MORE negative as it grows —
              both inverse-to-size, per the typography rules. `text-balance`
              replaces the manual <br>: the two sentences are separate blocks so
              the intended break is kept, but each can now wrap and re-balance
              instead of overflowing on a narrow phone. */}
          <h1 className="mt-8 text-balance text-[clamp(1.875rem,5.2vw,3.75rem)] leading-[1.14] tracking-[-0.005em] [font-weight:600] text-gray-900 md:leading-[1.06] md:tracking-[-0.025em]">
            <span className="block">
              Level Up Your <span className="text-accent-ink italic">Aptitude.</span>
            </span>
            <span className="block">Crack Your Next Test.</span>
          </h1>

          {/* Description. Measure capped in ch rather than px so it stays a
              comfortable ~62 characters as the type scales, and leading eases
              off slightly at the larger size. Body tracking stays near 0. */}
          <p className="mx-auto mt-5 max-w-[62ch] text-pretty text-lg leading-[1.6] text-gray-600 md:text-xl md:leading-[1.55]">
            Practice aptitude, reasoning, and verbal questions built around the placement tests of top companies and government exams.
          </p>

          {/* Two distinct paths: browse a topic, or go straight to a mock. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button onClick={() => onScrollTo('topics-section')} className="w-full sm:w-auto">
              Start Learning
            </Button>
            <Button
              variant="secondary"
              onClick={() => onScrollTo('mock-test-section')}
              showArrow={false}
              className="w-full sm:w-auto"
            >
              Try a Mock Test
            </Button>
          </div>
        </div>

        {/* Decorative card row. Sits at z-0 beneath the z-10 content above and
            is pointer-events-none + aria-hidden, so it can never intercept a
            click on the CTAs or reach a screen reader. */}
        <FloatingQuizCards />
      </div>
    </div>
  )
}
