import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react'

import { Cancel01Icon } from '@hugeicons/core-free-icons';

function Dialog({onClose,selectedSubtopic,onStart}) {
  const [questionCount, setQuestionCount] = useState();
  const [selectedDifficulty, setSelectedDifficulty] = useState('ai');
  const config = {
  subtopic: selectedSubtopic,
  selectedDifficulty: selectedDifficulty,
  count: questionCount,
  // mode: 'practice'
};





  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700 border-green-300' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { id: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 border-red-300' },
    { id: 'ai', label: 'AI Adaptive', color: 'bg-purple-100 text-purple-700 border-purple-300', recommended: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Practice Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Customize your practice session</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-lime-100 rounded-full transition-all group"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 text-gray-500 group-hover:text-lime-600 group-hover:drop-shadow-[0_0_3px_rgba(132,204,22,0.6)] transition-all" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Number of Questions</label>
              <span className="text-sm font-semibold text-gray-900">{questionCount} questions</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl py-3 px-4">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">
              Estimated time: <span className="font-medium text-gray-800">{questionCount} min</span>
            </span>
          </div>

          {/* Difficulty Options */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Difficulty Level</label>
            <div className="grid grid-cols-2 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`relative px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedDifficulty === diff.id
                      ? diff.color.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  } ${selectedDifficulty === diff.id ? 'border-current' : ''}`}
                >
                  {diff.recommended && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={()=>onStart(config)} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors">
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
