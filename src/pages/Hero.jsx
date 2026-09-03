import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import Reveal from '../components/ui/Reveal';

export default function Hero({ onShowTopics }) {
  return (
    <div className="max-w-screen-2xl justify-center text-gray-800 dark:text-text font-sans">
      {/* Content */}
      <div className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center py-12 sm:p-8">
        <Reveal className="max-w-5xl w-full text-center z-10 space-y-8">
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
            Version 1.0 Now Live
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-gray-900">
            Level Up Your <span className="text-lime-700 italic">Aptitude.</span><br />Crack Your Next Test.
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Practice aptitude, reasoning, and verbal questions built around the placement tests of top companies and Government Exam's .
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onShowTopics}
              className="w-full sm:w-auto px-8 py-4 bg-lime-400 text-white dark:text-[#17210a] font-bold rounded-xl shadow-lg shadow-lime-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Start Learning
              <HugeiconsIcon icon={ArrowRight02Icon} className="w-5 h-5" />
            </button>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
