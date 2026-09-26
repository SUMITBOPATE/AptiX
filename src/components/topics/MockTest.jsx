import { HugeiconsIcon } from '@hugeicons/react'
import { Book04Icon, TimerIcon } from '@hugeicons/core-free-icons'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import Spinner from '../ui/Spinner';

export default function MockTest({ questionCount = null, isStatsLoading = false }) {
  const hasQuestionCount = isStatsLoading || questionCount !== null;

  return (
    <section id="mock-test-section" className="theme-content-background scroll-mt-20 py-12">
      <Reveal className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Mock Tests
          </h2>
          <p className="text-gray-600 text-lg">
            Complete exam simulation with all topics combined
          </p>
        </div>

        <div className="bg-white dark:bg-surface rounded-2xl border border-gray-100 dark:border-border p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative shrink-0">
              {/* was text-gray-300 — 1.47:1 on white, effectively invisible */}
              <svg
                className="w-12 h-12 text-gray-500 dark:text-text-muted"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Premium
              </div>
            </div>

            <div>
              {/* h3 under the section h2 — was h4, which skipped a level */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Full-length practice simulation
              </h3>
              <div className="flex items-center gap-4 mt-2">
                {hasQuestionCount && (
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Book04Icon}
                      className="w-4 h-4 text-accent-ink"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {isStatsLoading ? <Spinner size="sm" /> : `${questionCount} Questions`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={TimerIcon}
                    className="w-4 h-4 text-accent-ink"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    Real exam timing
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Button to="/practice/mock-test" className="w-full md:w-auto">
              Launch Simulation
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
