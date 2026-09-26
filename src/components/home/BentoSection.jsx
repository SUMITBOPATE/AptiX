import { HugeiconsIcon } from '@hugeicons/react';
import { AbsoluteIcon, Activity02Icon, AiBrain01Icon, AiInnovation02Icon } from '@hugeicons/core-free-icons';
import Reveal from '../ui/Reveal';

const iconTile = 'w-12 h-12 bg-lime-100 dark:bg-lime-400/10 dark:border dark:border-lime-400/10 rounded-lg flex items-center justify-center mb-4';

export default function BentoSection() {
  return (
    <section className="theme-content-background py-12 md:py-16">
      <Reveal className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[2px] w-6 bg-lime-500" aria-hidden="true" />
          <h2 className="font-semibold text-sm uppercase tracking-[0.2em] text-accent-ink">Mastery Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 surface motion-card group relative p-6 bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-xl overflow-hidden hover:shadow-card hover:bg-gray-100 dark:hover:bg-surface-2 hover:border-accent-ink/30 dark:hover:border-lime-400/20">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className={iconTile}>
                  <HugeiconsIcon icon={AbsoluteIcon} className="hover-scale-icon w-6 h-6 text-accent-ink" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Fundamentals</h3>
                <p className="text-gray-600 max-w-md text-sm">Core mathematical concepts and logical frameworks designed for rapid mental computation and conceptual clarity.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-200 rounded-md text-xs font-medium text-gray-600">QUANT</span>
                <span className="px-3 py-1 bg-gray-200 rounded-md text-xs font-medium text-gray-600">LOGIC</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 surface p-6 bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-xl flex flex-col justify-between hover:bg-gray-100 dark:hover:bg-surface-2 hover:border-accent-ink/30 dark:hover:border-lime-400/20">
            <div>
              <div className={iconTile}>
                <HugeiconsIcon icon={Activity02Icon} className="hover-scale-icon w-6 h-6 text-accent-ink" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Real-time performance metrics tracking your speed, accuracy, and percentile rank.</p>
            </div>
            {/* Was a hardcoded "Accuracy: 78%" with a three-quarter-filled bar.
                A precise number on a marketing page reads as a real measurement.
                Naming the tracked signals makes the same point without the lie. */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {['Speed', 'Accuracy', 'Percentile'].map((metric) => (
                <li
                  key={metric}
                  className="px-3 py-1 bg-lime-100 dark:bg-lime-400/10 text-accent-ink rounded-md text-xs font-medium"
                >
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 surface motion-card group p-6 bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-xl hover:shadow-card hover:bg-gray-100 dark:hover:bg-surface-2 hover:border-accent-ink/30 dark:hover:border-lime-400/20">
            <div className={iconTile}>
              <HugeiconsIcon icon={AiBrain01Icon} className="hover-scale-icon w-6 h-6 text-accent-ink" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Precision</h3>
            <p className="text-gray-600 text-sm">Techniques to eliminate common pitfalls and cognitive biases.</p>
          </div>

          <div className="md:col-span-8 surface group p-6 bg-lime-800 text-white rounded-xl flex items-center gap-8 hover:bg-lime-700">
            <div className="flex-1 min-w-0">
              <div className="inline-block px-2 py-0.5 bg-white text-lime-800 text-xs font-bold rounded mb-4">
                Adaptive
              </div>
              <h3 className="text-2xl font-bold mb-2 break-words">Personalization</h3>
              <p className="text-white/80 text-sm max-w-sm break-words leading-relaxed">Our adaptive algorithm identifies your weak zones and creates a custom difficulty curve tailored to your learning pace.</p>
            </div>
            <div className="hidden md:block shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                <HugeiconsIcon icon={AiInnovation02Icon} className="hover-scale-icon w-10 h-10 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
