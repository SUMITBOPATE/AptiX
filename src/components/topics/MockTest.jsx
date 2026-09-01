import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book04Icon, TimerIcon } from '@hugeicons/core-free-icons'

export default function MockTest({ questionCount = null }) {
  return (
    <section className="py-12 bg-white dark:bg-bg">
      <div className="max-w-screen-2xl mx-auto ">
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
            <div className="relative">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Premium
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                Full-length practice simulation
              </h4>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Book04Icon}
                    className="w-4 h-4 text-lime-500"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {questionCount === null ? 'Loading…' : `${questionCount} Questions`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={TimerIcon}
                    className="w-4 h-4 text-lime-500"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    Real exam timing
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link to="/practice/mock-test">
              <button className="px-10 py-4 bg-lime-400 text-white dark:text-[#17210a] font-bold rounded-xl flex items-center gap-3 hover:bg-lime-600 active:scale-95 transition-all shadow-md shadow-lime-500/10">
                Launch Simulation 
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
