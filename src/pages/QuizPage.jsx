import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllQuestions, getQuestionsBySlug } from '../lib/supabase.js';
import QuizHeader from '../components/quiz/QuizHeader.jsx';
import QuizOption from '../components/quiz/QuizOption.jsx';
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import ResultComponent from "../components/quiz/ResultComponent.jsx"
import { getUniqueQuestions } from '../utils/questions.js';
import BackButton from '../components/ui/BackButton.jsx';
import ExitQuizDialog from '../components/quiz/ExitQuizDialog.jsx';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicSlug } = useParams();
  const { state } = location;

  const { subtopic, selectedDifficulty, count, isMockTest = false } = state || {};

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const questions = isMockTest
        ? await getAllQuestions()
        : await getQuestionsBySlug(topicSlug, subtopic?.slug);
      setAllQuestions(questions);
      setLoading(false);
    };
    fetchQuestions();
  }, [topicSlug, subtopic?.slug, isMockTest]);

  const filteredQuestions = useMemo(() => {
    const uniqueQuestions = getUniqueQuestions(allQuestions);

    const matchesDifficulty = (question) => {
      const difficulty = selectedDifficulty?.toLowerCase();
      const isCompanyQuestion = question.company !== null && question.company !== undefined;

      return difficulty === 'all'
        || isCompanyQuestion
        || (question.difficulty || question.level || '').toLowerCase() === difficulty;
    };

    if (!isMockTest) {
      return uniqueQuestions.filter(matchesDifficulty).slice(0, count || 10);
    }

    // Company-tagged questions get their own pool; otherwise use broad aptitude
    // categories so a short mock still contains Quant, Reasoning, and Verbal.
    const getMockGroup = (question) => {
      if (question.company) return `company:${question.company}`;
      const category = `${question.category || question.topic_slug || question.subcategory || 'other'}`.toLowerCase();
      if (category.includes('quant')) return 'quantitative';
      if (category.includes('reason') || category.includes('logical')) return 'reasoning';
      if (category.includes('verbal')) return 'verbal';
      return category;
    };

    const groups = uniqueQuestions.reduce((result, question) => {
      const category = getMockGroup(question);
      (result[category] ||= []).push(question);
      return result;
    }, {});
    const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
    // Prefer the selected difficulty within every category. If a category has no
    // questions at that level, retain it using its available questions instead of
    // returning a Quant-only mock.
    const buckets = Object.values(groups).map((questions) => {
      const difficultyMatches = questions.filter(matchesDifficulty);
      return shuffle(difficultyMatches.length ? difficultyMatches : questions);
    });
    const mixedQuestions = [];

    while (mixedQuestions.length < (count || 10) && buckets.some((bucket) => bucket.length)) {
      shuffle(buckets).forEach((bucket) => {
        if (bucket.length && mixedQuestions.length < (count || 10)) {
          mixedQuestions.push(bucket.pop());
        }
      });
    }

    return mixedQuestions;
  }, [allQuestions, selectedDifficulty, count, isMockTest]);
  const total = filteredQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptedAnswers, setAttemptedAnswers] = useState({}); // Track all attempts per question
  const [questionResolved, setQuestionResolved] = useState({}); // Track if question is resolved (correct or show answer clicked)
  const [showAnswer, setShowAnswer] = useState(false); // Track if show answer was clicked
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (isQuizComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isQuizComplete]);

  const currentQuestion = filteredQuestions[currentIndex];

  const getQuestionOptions = (question) => [
    question?.option_a,
    question?.option_b,
    question?.option_c,
    question?.option_d,
  ];

  const normalizeAnswer = (value) => `${value ?? ''}`.trim().toLowerCase();

  // Questions imported from different sources store the answer either as an
  // option letter ("A") or as the option text itself ("20%"). Resolve both.
  const getCorrectOptionText = (question) => {
    const options = getQuestionOptions(question);
    const rawAnswer = `${question?.correct_answer ?? question?.correctAnswer ?? ''}`.trim();
    const letterMatch = rawAnswer.match(/^(?:option\s*)?([a-d])(?:[.)])?$/i);

    if (letterMatch) return options[letterMatch[1].toUpperCase().charCodeAt(0) - 65];

    return options.find(option => normalizeAnswer(option) === normalizeAnswer(rawAnswer));
  };

  const isCorrectOption = (option, question = currentQuestion) =>
    normalizeAnswer(option) === normalizeAnswer(getCorrectOptionText(question));

  const handleSelect = (option) => {
    // If question is already resolved, don't allow more selections
    if (questionResolved[currentIndex]) return;

    setShowAnswerHint(false);

    if (isMockTest) {
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
      setQuestionResolved((prev) => ({ ...prev, [currentIndex]: true }));
      return;
    }

    // If this is the correct answer
    if (isCorrectOption(option)) {
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
      setQuestionResolved((prev) => ({ ...prev, [currentIndex]: true }));
      return;
    }

    // If it's a wrong answer, add to attempted answers and keep tracking
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
    setAttemptedAnswers((prev) => ({
      ...prev,
      [currentIndex]: [...(prev[currentIndex] || []), option],
    }));
  };

  const handleShowAnswer = () => {
    const hasAttemptedOption = Boolean(selectedAnswers[currentIndex])
      || (attemptedAnswers[currentIndex]?.length ?? 0) > 0;

    if (!hasAttemptedOption) {
      setShowAnswerHint(true);
      return;
    }

    const correctText = getCorrectOptionText(currentQuestion);
    if (correctText === undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: correctText }));
    setRevealedAnswers((prev) => ({ ...prev, [currentIndex]: true }));
    setShowAnswer(true);
    setQuestionResolved((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setShowExplanation(false);
      setShowAnswer(false);
      setShowAnswerHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowExplanation(false);
      setShowAnswer(false);
      setShowAnswerHint(false);
    }
  };

  const handleFinishQuiz = (attemptedOnly = false) => {
    const questionsToScore = filteredQuestions
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => !attemptedOnly || selectedAnswers[index] !== undefined);

    const finalAnswers = questionsToScore.map(({ question, index }) => {
      return {
        questionId: question.id,
        questionText: question.question,
        options: [question.option_a, question.option_b, question.option_c, question.option_d],
        userAnswer: revealedAnswers[index] ? 'N/A' : selectedAnswers[index],
        correctAnswer: getCorrectOptionText(question),
        isCorrect: !revealedAnswers[index] && isCorrectOption(selectedAnswers[index], question),
        isNA: Boolean(revealedAnswers[index]),
        explanation: question.explanation
      };
    });

    setAnswers(finalAnswers);
    setShowExitDialog(false);
    setIsQuizComplete(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setAnswers([]);
    setTimer(0);
    setShowExplanation(false);
    setAttemptedAnswers({});
    setQuestionResolved({});
    setShowAnswer(false);
    setShowAnswerHint(false);
    setRevealedAnswers({});
    setIsQuizComplete(false);
  };

  // Calculate score for header
  const score = isMockTest ? 0 : Object.keys(selectedAnswers).filter((key) => {
    if (revealedAnswers[key]) return false;
    const question = filteredQuestions[key];
    const userAnswer = selectedAnswers[key];
    return isCorrectOption(userAnswer, question);
  }).length;

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
          <p>No questions found for this configuration.</p>
          <BackButton onClick={() => navigate(-1)} label="Go Back" />
        </div>
      </div>
    );
  }

  // Conditional rendering for Results
  if (isQuizComplete) {
    // Format timer as MM:SS
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
        onBackToTopics={() => navigate('/')}
      />
    );
  }

  const isLastQuestion = currentIndex === total - 1;
  const hasAttemptedCurrentQuestion = Boolean(selectedAnswers[currentIndex])
    || (attemptedAnswers[currentIndex]?.length ?? 0) > 0;

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
        subtopicName={subtopic?.name}
        difficulty={selectedDifficulty}
        onExit={() => setShowExitDialog(true)}
      />

      {showExitDialog && (
        <ExitQuizDialog
          hasAttempts={Object.keys(selectedAnswers).length > 0}
          onContinue={() => setShowExitDialog(false)}
          onExit={() => navigate(-1)}
          onViewResults={() => handleFinishQuiz(true)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-4 gap-4 relative z-10">

        {/* Question card with footer */}
        <div className="w-full min-h-[350px] sm:min-h-[400px] max-w-[700px] bg-white dark:bg-[#1B2014] border-1 border-dashed border-gray-200 dark:border-[#343B29] p-4 sm:p-6 flex flex-col gap-3">
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
            {[currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d].map((option, i) => {
              const isCorrect = isCorrectOption(option);
              const isAttempted = (attemptedAnswers[currentIndex] || []).includes(option);
              const isSelected = selectedAnswers[currentIndex] === option;
              let optionState = 'default';
              
              if (!isMockTest) {
                if (isSelected && isCorrect) {
                  optionState = 'correct';
                } else if (isAttempted && !isCorrect) {
                  optionState = 'wrong';
                } else if (showAnswer && isCorrect) {
                  optionState = 'correct';
                }
              }

              return (
                <QuizOption
                  key={i}
                  index={i}
                  text={option}
                  selected={isSelected}
                  state={optionState}
                  disabled={isMockTest ? questionResolved[currentIndex] : questionResolved[currentIndex] && !isCorrect}
                  onSelect={() => handleSelect(option)}
                />
              );
            })}
          </div>

          {/* Feedback and Show Answer Button */}
          <div className="space-y-2 mt-2">
            {!isMockTest && selectedAnswers[currentIndex] && (
              <div
                className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isCorrectOption(selectedAnswers[currentIndex])
                    ? 'bg-[#f0fdf4] dark:bg-green-500/10 text-primary-strong dark:text-green-300 border border-[#bbf7d0] dark:border-green-500/40'
                    : 'bg-[#fff5f5] dark:bg-red-500/10 text-danger dark:text-red-300 border border-[#fecaca] dark:border-red-500/40'
                }`}
              >
                {isCorrectOption(selectedAnswers[currentIndex])
                  ? '✓ Correct!'
                  : `✗ Incorrect — Answer: ${getCorrectOptionText(currentQuestion)}`}
              </div>
            )}

            {!isMockTest && !questionResolved[currentIndex] && (
              <div className="relative">
                {showAnswerHint && (
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                  >
                    Please click one option above first
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
                <button
                  onClick={handleShowAnswer}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-dashed border-text-muted text-text-muted hover:bg-surface-2 transition-all"
                >
                  Show Answer
                </button>
              </div>
            )}

            {/* Explanation Toggle */}
            {!isMockTest && currentQuestion.explanation && selectedAnswers[currentIndex] && (
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
              onClick={() => handleFinishQuiz()}
              disabled={!hasAttemptedCurrentQuestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-white bg-lime-500 hover:bg-lime-600 disabled:opacity-[0.35] disabled:cursor-not-allowed transition-all"
            >
              Finish
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAttemptedCurrentQuestion}
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
