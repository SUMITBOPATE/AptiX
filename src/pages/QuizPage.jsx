import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestionsBySlug } from '../data/questions.js';
import QuizHeader from '../components/QuizHeader';
import QuizOption from '../components/QuizOption';
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const { subtopic, selectedDifficulty, count } = state || {};

  const allQuestions = getQuestionsBySlug(subtopic?.slug);
  const filteredQuestions = allQuestions
    .filter((q) => q.level === selectedDifficulty)
    .slice(0, count || 10);
  const total = filteredQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentQuestion = filteredQuestions[currentIndex + 2];

  const handleSelect = (option) => {
    if (selectedAnswers[currentIndex] !== undefined) return;
    const isCorrect = option === currentQuestion?.correctAnswer;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => { if (currentIndex < total - 1) setCurrentIndex((i) => i + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex((i) => i - 1); };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>No questions found for this configuration.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer bg-primary text-white border-none hover:bg-primary-soft transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const selectedForCurrent = selectedAnswers[currentIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Decorative rails */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
        <div className="absolute left-0 top-0 h-full w-10 border-x border-dotted border-gray-200 slanted-rail-left" />
        <div className="absolute right-0 top-0 h-full w-10 border-x border-dotted border-gray-200 slanted-rail-right" />
      </div>

      {/* Header */}
      <QuizHeader
        currentIndex={currentIndex}
        totalQuestions={total}
        timer={timer}
        score={score}
        subtopicName={subtopic?.name}
        difficulty={selectedDifficulty}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-4 gap-4 relative z-10">

        {/* Question card with footer */}
        <div className="w-full min-h-[350px] sm:min-h-[400px] max-w-[700px] bg-white border-1 border-dashed border-gray-200  p-4 sm:p-6 flex flex-col gap-3">
          {/* Subtopic & Difficulty - Mobile visible */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-xs font-medium text-text-muted">{subtopic?.name}</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-medium text-text-muted capitalize">{selectedDifficulty}</span>
          </div>

          <p className="text-[0.7rem] font-bold tracking-[0.08em] text-text-muted uppercase m-0">
            QUESTION {currentIndex + 1} OF {total}
          </p>

          <h2 className="text-[1rem] font-medium text-text-strong leading-relaxed m-0">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {currentQuestion.options.map((option, i) => (
              <QuizOption
                key={i}
                index={i}
                text={option}
                selected={selectedForCurrent === option}
                onSelect={() => handleSelect(option)}
              />
            ))}
          </div>

          {/* Feedback */}
          {selectedForCurrent && (
            <div
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                selectedForCurrent === currentQuestion.correctAnswer
                  ? 'bg-[#f0fdf4] text-primary-strong border border-[#bbf7d0]'
                  : 'bg-[#fff5f5] text-danger border border-[#fecaca]'
              }`}
            >
              {selectedForCurrent === currentQuestion.correctAnswer
                ? '✓ Correct!'
                : `✗ Incorrect — Answer: ${currentQuestion.correctAnswer}`}
            </div>
          )}
        </div>
      </main>

      {/* Footer with Navigation */}
      <footer className="border-t border-dashed border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
        <div className="max-w-[700px] mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-text-strong hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-[0.75rem] text-text-muted tabular-nums">
            {currentIndex + 1} / {total}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-primary hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed transition-all"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
