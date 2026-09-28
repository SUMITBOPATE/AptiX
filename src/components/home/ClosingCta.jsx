import Button from '../ui/Button'
import { COPY } from '../../lib/copy';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
};

export default function ClosingCta({ onStart }) {
  return (
    <section className="theme-content-background pt-12 md:pt-16 pb-16 md:pb-24">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center sm:px-12 dark:border-border dark:bg-surface">
        <h2 className="mb-4 text-3xl font-semibold leading-[1.15] tracking-tight text-gray-900 md:text-4xl">
          Ready to put it in practice?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600">
          Pick a topic and work through it timed, or jump into a full mock test to see where you stand.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={onStart} className="w-full sm:w-auto">
            {COPY.startLearning}
          </Button>
          {/* Both CTAs route through the same reduced-motion-aware helper rather
              than a hardcoded `behavior: 'smooth'`, which is what this had
              before. */}
          <Button
            variant="secondary"
            showArrow={false}
            onClick={() => scrollTo('mock-test-section')}
            className="w-full sm:w-auto"
          >
            {COPY.tryMockTest}
          </Button>
        </div>
      </div>
    </section>
  );
}
