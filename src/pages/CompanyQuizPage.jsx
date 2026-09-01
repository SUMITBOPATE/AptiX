import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { companiesData } from '../../data/companies';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizOption from '../components/quiz/QuizOption';
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import ResultComponent from '../components/quiz/ResultComponent';

export default function CompanyQuizPage() {
  const { slug, categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const company = companiesData.find(c => c.slug === slug);
  const selectedDifficulty = state?.selectedDifficulty || 'easy';
  const questionsCount = state?.count || 10;

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Fetch questions for the company and category
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('company', company.name);

      if (data) {
        let filtered = data;

        // Filter by category if not 'all'
        if (categorySlug !== 'all') {
          filtered = data.filter(q => {
            const cat = q.category?.toLowerCase().trim();
            if (categorySlug === 'quantitative') {
              return cat === 'quantitative' || cat === 'quant';
            } else if (categorySlug === 'reasoning') {
              return cat === 'reasoning' || cat === 'logical reasoning';
            } else if (categorySlug === 'verbal') {
              return cat === 'verbal' || cat === 'verbal reasoning';
            }
            return false;
          });
        }

        // Limit by question count
        filtered = filtered.slice(0, questionsCount);

        setAllQuestions(filtered);
      }
      setLoading(false);
    };

    if (company) {
      fetchQuestions();
    }
  }, [company, categorySlug, questionsCount]);

  const filteredQuestions = allQuestions;
  const total = filteredQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [attemptedAnswers, setAttemptedAnswers] = useState({}); // Track all attempts per question
  const [questionResolved, setQuestionResolved] = useState({}); // Track if question is resolved
  const [showAnswer, setShowAnswer] = useState(false); // Track if show answer was clicked
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isQuizComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isQuizComplete]);

  const currentQuestion = filteredQuestions[currentIndex];

  // Helper function to get option text from letter (A, B, C, D)
  const getOptionTextFromLetter = (letter) => {
    const options = {
      'A': currentQuestion.option_a,
      'B': currentQuestion.option_b,
      'C': currentQuestion.option_c,
      'D': currentQuestion.option_d,
    };
    return options[letter?.toUpperCase()];
  };

  // Helper function to get letter (A, B, C, D) from option text
  const getLetterFromOptionText = (option) => {
    if (option === currentQuestion.option_a) return 'A';
    if (option === currentQuestion.option_b) return 'B';
    if (option === currentQuestion.option_c) return 'C';
    if (option === currentQuestion.option_d) return 'D';
    return null;
  };

  const handleSelect = (option) => {
    // If question is already resolved, don't allow more selections
    if (questionResolved[currentIndex]) return;

    const optionLetter = getLetterFromOptionText(option);

    // If this is the correct answer
    if (optionLetter === currentQuestion.correct_answer?.toUpperCase()) {
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
      setQuestionResolved((prev) => ({ ...prev, [currentIndex]: true }));
      return;
    }

    // If it's a wrong answer, add to attempted answers and keep tracking
    setAttemptedAnswers((prev) => ({
      ...prev,
      [currentIndex]: [...(prev[currentIndex] || []), option],
    }));
  };

  const handleShowAnswer = () => {
    const correctText = getOptionTextFromLetter(currentQuestion.correct_answer);
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: correctText }));
    setShowAnswer(true);
    setQuestionResolved((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setShowExplanation(false);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowExplanation(false);
      setShowAnswer(false);
    }
  };

  const handleFinishQuiz = () => {
    const finalAnswers = filteredQuestions.map((question, index) => {
      // Helper to get letter from option text for this specific question
      const getLetterForQuestion = (option, q) => {
        if (option === q.option_a) return 'A';
        if (option === q.option_b) return 'B';
        if (option === q.option_c) return 'C';
        if (option === q.option_d) return 'D';
        return null;
      };
      
      return {
        questionId: question.id,
        questionText: question.question,
        options: [question.option_a, question.option_b, question.option_c, question.option_d],
        userAnswer: selectedAnswers[index],
        correctAnswer: getOptionTextFromQuestion(question.correct_answer, question),
        isCorrect: getLetterForQuestion(selectedAnswers[index], question) === question.correct_answer?.toUpperCase(),
        explanation: question.explanation,
      };
    });

    setAnswers(finalAnswers);
    setIsQuizComplete(true);
  };

  const getOptionTextFromQuestion = (letter, question) => {
    const options = {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    };
    return options[letter?.toUpperCase()];
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setAnswers([]);
    setTimer(0);
    setAttemptedAnswers({});
    setQuestionResolved({});
    setShowAnswer(false);
    setShowExplanation(false);
    setIsQuizComplete(false);
  };

  // Calculate score for header
  const score = Object.keys(selectedAnswers).filter(
    (key) => getLetterFromOptionText(selectedAnswers[key]) === filteredQuestions[key]?.correct_answer?.toUpperCase()
  ).length;

  const categoryDisplayNames = {
    all: 'All Questions',
    quantitative: 'Quantitative',
    reasoning: 'Reasoning',
    verbal: 'Verbal',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>No questions found for this category.</p>
          <button
            onClick={() => navigate(`/practice/company/${slug}`)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer bg-primary text-white border-none hover:bg-primary-soft transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Conditional rendering for Results
  if (isQuizComplete) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
      <ResultComponent
        answers={answers}
        timeTaken={formattedTime}
        onReview={(index) => {
          setCurrentIndex(index);
          setIsQuizComplete(false);
        }}
        onRestart={handleRestart}
        onBackToTopics={() => navigate(`/practice/company/${slug}`)}
      />
    );
  }

  const selectedForCurrent = selectedAnswers[currentIndex];
  const isLastQuestion = currentIndex === total - 1;

  return (
    <div className="theme-page min-h-screen bg-white flex flex-col relative">
      {/* Decorative rails */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
        <div className="absolute left-0 top-0 h-full w-10 border-l-[1.8px] border-r-[1.8px] border-dotted border-gray-200 dark:border-white/[0.05] slanted-rail-left" />
        <div className="absolute right-0 top-0 h-full w-10 border-l-[1.8px] border-r-[1.8px] border-dotted border-gray-200 dark:border-white/[0.05] slanted-rail-right" />
      </div>

      {/* Header */}
      <QuizHeader
        currentIndex={currentIndex}
        totalQuestions={total}
        timer={timer}
        score={score}
        subtopicName={`${company?.name} - ${categoryDisplayNames[categorySlug]}`}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-4 gap-4 relative z-10">
        {/* Question card with footer */}
        <div className="w-full min-h-[350px] sm:min-h-[400px] max-w-[700px] bg-white dark:bg-[#1B2014] border-1 border-dashed border-gray-200 dark:border-[#343B29] p-4 sm:p-6 flex flex-col gap-3">
          {/* Subtopic & Difficulty - Mobile visible */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-xs font-medium text-text-muted">{company?.name}</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-medium text-text-muted capitalize">{categoryDisplayNames[categorySlug]}</span>
          </div>

          <p className="text-[0.7rem] font-bold tracking-[0.08em] text-text-muted uppercase m-0">
            QUESTION {currentIndex + 1} OF {total}
          </p>

          <h2 className="text-[1rem] font-medium text-text-strong leading-relaxed m-0">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {[currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d].map((option, i) => {
              const isCorrect = getLetterFromOptionText(option) === currentQuestion.correct_answer?.toUpperCase();
              const isAttempted = (attemptedAnswers[currentIndex] || []).includes(option);
              const isSelected = selectedAnswers[currentIndex] === option;
              let optionState = 'default';
              
              if (isSelected && isCorrect) {
                optionState = 'correct';
              } else if (isAttempted && !isCorrect) {
                optionState = 'wrong';
              } else if (showAnswer && isCorrect) {
                optionState = 'correct';
              }

              return (
                <QuizOption
                  key={i}
                  index={i}
                  text={option}
                  selected={isSelected}
                  state={optionState}
                  disabled={questionResolved[currentIndex] && !isCorrect}
                  onSelect={() => handleSelect(option)}
                />
              );
            })}
          </div>

          {/* Feedback and Show Answer Button */}
          <div className="space-y-2 mt-2">
            {selectedAnswers[currentIndex] && (
              <div
                className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                  getLetterFromOptionText(selectedAnswers[currentIndex]) === currentQuestion.correct_answer?.toUpperCase()
                    ? 'bg-[#f0fdf4] dark:bg-green-500/10 text-primary-strong dark:text-green-300 border border-[#bbf7d0] dark:border-green-500/40'
                    : 'bg-[#fff5f5] dark:bg-red-500/10 text-danger dark:text-red-300 border border-[#fecaca] dark:border-red-500/40'
                }`}
              >
                {getLetterFromOptionText(selectedAnswers[currentIndex]) === currentQuestion.correct_answer?.toUpperCase()
                  ? '✓ Correct!'
                  : `✗ Incorrect — Answer: ${getOptionTextFromLetter(currentQuestion.correct_answer)}`}
              </div>
            )}

            {!questionResolved[currentIndex] && (
              <button
                onClick={handleShowAnswer}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-dashed border-text-muted text-text-muted hover:bg-surface-2 transition-all"
              >
                Show Answer
              </button>
            )}

            {/* Explanation Toggle */}
            {currentQuestion.explanation && selectedAnswers[currentIndex] && (
              <div>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  <span>📖 Explanation</span>
                  <span className={`transform transition-transform ${showExplanation ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Explanation Content */}
                {showExplanation && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                    {currentQuestion.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Navigation */}
      <footer className="theme-quiz-footer border-t border-dashed border-gray-200 dark:border-white/[0.05] bg-gray-50 px-4 sm:px-6 py-3">
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

          {isLastQuestion ? (
            <button
              onClick={handleFinishQuiz}
              disabled={!questionResolved[currentIndex]}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-white bg-lime-500 hover:bg-lime-600 disabled:opacity-[0.35] disabled:cursor-not-allowed transition-all"
            >
              Finish
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!questionResolved[currentIndex]}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-primary hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
