import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, CancelCircleIcon, ArrowRight01Icon, RefreshIcon, HomeIcon, TimeIcon } from '@hugeicons/core-free-icons';

const ResultComponent = ({ answers, timeTaken, onReview, onRestart, onBackToTopics }) => {
  // Derive score from answers array
  const correct = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Calculate circle progress (correct out of total)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (correct / total) * circumference;

  return (
    <div className="theme-page min-h-screen bg-white flex flex-col">
      {/* Header - Simple white with border */}
      <div className="border-b border-gray-200 dark:border-[#343B29] px-6 py-6 bg-white">
        <h1 className="text-xl font-semibold text-gray-800 text-center">Quiz Complete</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Here's your performance summary</p>
      </div>

      {/* Score Circle */}
      <div className="px-6 py-6">
        <div className="max-w-2xl mx-auto flex justify-center">
          <div className="relative w-44 h-44">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="12"
              />
              {/* Progress circle - lime color */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="#84cc16"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{correct}</span>
              <span className="text-gray-400 text-sm">out of {total}</span>
              <span className="text-lime-500 text-sm font-medium mt-1">{accuracy}% Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            {/* Correct */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-600">{correct}</p>
              <p className="text-xs text-green-600 font-medium">Correct</p>
            </div>

            {/* Wrong */}
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
              <HugeiconsIcon icon={CancelCircleIcon} className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-600">{wrong}</p>
              <p className="text-xs text-red-600 font-medium">Wrong</p>
            </div>

            {/* Time */}
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-center">
              <HugeiconsIcon icon={TimeIcon} className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-700">{timeTaken || '0:00'}</p>
              <p className="text-xs text-gray-500 font-medium">Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-400 text-white rounded-lg font-medium text-sm hover:bg-lime-500 transition"
          >
            <HugeiconsIcon icon={RefreshIcon} className="w-4 h-4" />
            Retry Quiz
          </button>
          <button
            onClick={onBackToTopics}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition"
          >
            <HugeiconsIcon icon={HomeIcon} className="w-4 h-4" />
            Back to Topics
          </button>
        </div>
      </div>

      {/* Question Review List */}
      <div className="flex-1 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Review Answers</h2>

          <div className="space-y-2">
            {answers.map((answer, index) => {
              const isCorrect = answer.isCorrect;

              return (
                <div
                  key={index}
                  onClick={() => onReview(index)}
                  className="p-3 rounded-lg border border-gray-200 dark:border-[#343B29] bg-white cursor-pointer transition-colors duration-200 hover:border-lime-300 dark:hover:bg-[#22291A] dark:hover:border-lime-400/20 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon - Simple circle */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCorrect ? (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-green-600" />
                      ) : (
                        <HugeiconsIcon icon={CancelCircleIcon} className="w-3 h-3 text-red-600" />
                      )}
                    </div>

                    {/* Question & Answer */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {index + 1}. {answer.questionText}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {!isCorrect && answer.userAnswer && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
                            Your answer: {answer.userAnswer}
                          </span>
                        )}
                        <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
                          Correct: {answer.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultComponent;
