import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {ArrowRight02Icon, AbsoluteIcon, Activity02Icon, AiBrain01Icon, AiInnovation02Icon } from '@hugeicons/core-free-icons';

export default function Hero({ onShowTopics }) {
  return (
    <div className="min-h-screen max-w-screen-2xl justify-center text-gray-800 dark:text-text font-sans">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen sm:p-8">
        <div className="max-w-6xl w-full text-center z-10 space-y-8">
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
            Version 1.0 Now Live
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            Level Up Your <span className="text-lime-700 italic">Aptitude.</span><br />Crack Your First Job.
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Master quantitative reasoning, logical deduction, and verbal precision with our high-performance technical training platform.
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
        </div>

        {/* Bento Grid Section */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-6 bg-lime-500"></div>
            <h2 className="font-semibold text-sm uppercase tracking-[0.2em] text-lime-600">Mastery Pillars</h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Fundamentals - Large */}
            <div className="md:col-span-8 group relative p-6 bg-gray-50 dark:bg-[#1B2014] border border-gray-200 dark:border-[#343B29] rounded-xl overflow-hidden hover:shadow-xl dark:hover:bg-[#22291A] dark:hover:border-lime-400/20 transition-all duration-500">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-lime-100 dark:bg-lime-400/10 dark:border dark:border-lime-400/10 rounded-lg flex items-center justify-center mb-4">
                    <HugeiconsIcon icon={AbsoluteIcon} className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Fundamentals</h3>
                  <p className="text-gray-600 max-w-md text-sm">Core mathematical concepts and logical frameworks designed for rapid mental computation and conceptual clarity.</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-gray-200 rounded-md text-xs font-medium text-gray-600">QUANT</span>
                  <span className="px-3 py-1 bg-gray-200 rounded-md text-xs font-medium text-gray-600">LOGIC</span>
                </div>
              </div>
            </div>

            {/* Analytics - Medium */}
            <div className="md:col-span-4 p-6 bg-gray-50 dark:bg-[#1B2014] border border-gray-200 dark:border-[#343B29] rounded-xl flex flex-col justify-between">
              <div> 
                <div className="w-12 h-12 bg-lime-100 dark:bg-lime-400/10 dark:border dark:border-lime-400/10 rounded-lg flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={Activity02Icon} className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600 text-sm">Real-time performance metrics tracking your speed, accuracy, and percentile rank.</p>
              </div>
              <div className="mt-6">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-lime-500"></div>
                </div>
                <p className="text-xs mt-2 font-medium text-lime-600">Accuracy: 78%</p>
              </div>
            </div>

            {/* Precision - Small */}
            <div className="md:col-span-4 p-6 bg-gray-50 dark:bg-[#1B2014] border border-gray-200 dark:border-[#343B29] rounded-xl hover:bg-gray-100 dark:hover:bg-[#22291A] dark:hover:border-lime-400/20 transition-colors group">
              <div className="w-12 h-12 bg-lime-100 dark:bg-lime-400/10 dark:border dark:border-lime-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={AiBrain01Icon} className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Precision</h3>
              <p className="text-gray-600 text-sm">Techniques to eliminate common pitfalls and cognitive biases.</p>
            </div>

            {/* AI Mode - Large */}
            <div className="md:col-span-8 p-6 bg-lime-800 text-white rounded-xl flex items-center gap-8">
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 bg-white text-lime-600 text-xs font-bold rounded mb-4">NEURAL ENGINE</div>
                <h3 className="text-2xl font-bold mb-2 break-words ">AI Personalization</h3>
                <p className="text-white/70 text-sm max-w-sm break-words leading-relaxed">Our adaptive algorithm identifies your weak zones and creates a custom difficulty curve tailored to your learning pace.</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                  <HugeiconsIcon icon={AiInnovation02Icon} className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
