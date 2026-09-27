import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getQuestions } from '../lib/supabase';
import { companiesData } from '../../data/companies';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizOption from '../components/quiz/QuizOption';
import ArrowLeft from '../icons/ArrowLeft';
import ArrowRight from '../icons/ArrowRight';
import ResultComponent from '../components/quiz/ResultComponent';
import { getUniqueQuestions } from '../utils/questions.js';
import BackButton from '../components/ui/BackButton.jsx';
import ExitQuizDialog from '../components/quiz/ExitQuizDialog.jsx';
import LoadingState from '../components/ui/LoadingState';

// The route category is a short UI slug; the database stores longer canonical
// slugs. Declared outside the component so it keeps the same identity between
// renders and does not retrigger the fetch effect.
const CATEGORY_SLUG_BY_ROUTE = {
  quantitative: 'quantitative-aptitude',
  reasoning: 'logical-reasoning',
  verbal: 'verbal-ability',
};

export default function CompanyQuizPage() {
  const { slug, categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const company = companiesData.find(c => c.slug === slug);
  // Defaulting to 'easy' meant a visitor who opened this URL directly, with no
  // dialog state, was silently restricted to Easy questions and given no
  // indication of it. 'all' is the honest default when nothing was chosen.
  const selectedDifficulty = state?.selectedDifficulty || 'all';
  const questionsCount = state?.count || 10;

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Fetch questions for the company and category
  useEffect(() => {
    if (!company) return undefined;

    let active = true;

    // Difficulty filtering still runs in JavaScript (see the note in
    // supabase.js about the difficulty column), so ask for extra rows. Limiting
    // in SQL and filtering by difficulty afterwards is what previously made this
    // quiz come up empty: the first N rows were taken regardless of difficulty,
    // and if none of them happened to match, the visitor got "No questions".
    const poolSize = Math.min(questionsCount * 3, 200);

    const fetchQuestions = async () => {
      setLoading(true);
      setLoadFailed(false);
      try {
        // Company, category and limit are all applied by Postgres. Previously
        // this downloaded every question for the company and filtered in JS.
        const rows = await getQuestions({
          company: company.name,
          category: CATEGORY_SLUG_BY_ROUTE[categorySlug],
          limit: poolSize,
        });

        if (!active) return;
        setAllQuestions(rows);
      } catch (err) {
        // getQuestions rethrows on a database error. Unhandled, the rejection
        // escaped and setLoading(false) never ran, leaving a permanent spinner.
        console.error('Unable to load questions:', err);
        if (active) setLoadFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQuestions();
    return () => { active = false; };
  }, [company, categorySlug, questionsCount]);

  // Difficulty was being read from the dialog config and then never applied,
  // so picking Hard or Medium in the setup dialog silently returned the same
  // questions as Easy. Mirrors QuizPage's matchesDifficulty, minus the
  // isCompanyQuestion escape hatch (everything here is already company-scoped).
  const matchesDifficulty = (question) => {
    const difficulty = selectedDifficulty?.toLowerCase();
    return (
      !difficulty ||
      difficulty === 'all' ||
      `${question?.difficulty || question?.level || ''}`.toLowerCase() === difficulty
    );
  };

  // Order matters: filter by difficulty FIRST, then take the requested number.
  // The old code did the opposite — it sliced inside the fetch and filtered
  // afterwards — so asking for 10 Medium questions could return nothing even
  // when the company had dozens.
  const filteredQuestions = getUniqueQuestions(allQuestions.filter(matchesDifficulty)).slice(
    0,
    questionsCount
  );
  const total = filteredQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [attemptedAnswers, setAttemptedAnswers] = useState({}); // Track all attempts per question
  const [questionResolved, setQuestionResolved] = useState({}); // Track if question is resolved
  const [showAnswer, setShowAnswer] = useState(false); // Track if show answer was clicked
  const [showExplanation, setShowExplanation] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (isQuizComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isQuizComplete]);

  const currentQuestion = filteredQuestions[currentIndex];

  // Difficulty filtering is new here, so a mismatch can now legitimately produce
  // an empty set. Without this the render below dereferences
  // currentQuestion.option_a and throws. Mirrors QuizPage's guard.
  if (!currentQuestion) {
    return (
      <div className="theme-page min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center text-text">
          <p>No questions found for this configuration.</p>
          <BackButton onClick={() => navigate(-1)} label="Go Back" />
        </div>
      </div>
    );
  }

  // Helper function to get the options of a question
  const getQuestionOptions = (question) => [
    question?.option_a,
    question?.option_b,
    question?.option_c,
    question?.option_d,
  ];

  const normalizeAnswer = (value) => `${value ?? ''}`.trim().toLowerCase();

  // Company questions come from different sources, so the answer is stored
  // either as an option letter ("A") or as the option text ("20%").
  // Resolve both to the option text.
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
    const correctText = getCorrectOptionText(currentQuestion);
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
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowExplanation(false);
      setShowAnswer(false);
    }
  };

  const handleFinishQuiz = (attemptedOnly = false) => {
    const questionsToScore = filteredQuestions
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => !attemptedOnly || selectedAnswers[index] !== undefined);

    const finalAnswers = questionsToScore.map(({ question, index }) => ({
      questionId: question.id,
      questionText: question.question,
      options: getQuestionOptions(question),
      userAnswer: revealedAnswers[index] ? 'N/A' : selectedAnswers[index],
      correctAnswer: getCorrectOptionText(question),
      isCorrect: !revealedAnswers[index] && isCorrectOption(selectedAnswers[index], question),
      isNA: Boolean(revealedAnswers[index]),
      explanation: question.explanation,
    }));

    setAnswers(finalAnswers);
    setShowExitDialog(false);
    setIsQuizComplete(true);
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
    setRevealedAnswers({});
    setIsQuizComplete(false);
  };

  // Calculate score for header
  const score = Object.keys(selectedAnswers).filter(
    (key) => !revealedAnswers[key] && isCorrectOption(selectedAnswers[key], filteredQuestions[key])
  ).length;

  const categoryDisplayNames = {
    all: 'All Questions',
    quantitative: 'Quantitative',
    reasoning: 'Reasoning',
    verbal: 'Verbal',
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <LoadingState label="Loading questions" className="flex-1" />
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>Could not load questions. Check your connection and try again.</p>
          <BackButton onClick={() => navigate(`/practice/company/${slug}`)} label="Go Back" />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>No questions found for this category.</p>
          <BackButton onClick={() => navigate(`/practice/company/${slug}`)} label="Go Back" />
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

  // (removed `selectedForCurrent` - it duplicated selectedAnswers[currentIndex],
  //  which is already read directly where it is needed)
  const isLastQuestion = currentIndex === total - 1;
  const hasAttemptedCurrentQuestion = Boolean(selectedAnswers[currentIndex])
    || (attemptedAnswers[currentIndex]?.length ?? 0) > 0;

  return (
    <div className="theme-page min-h-dvh bg-white flex flex-col relative">
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
        onExit={() => setShowExitDialog(true)}
      />

      {showExitDialog && (
        <ExitQuizDialog
          hasAttempts={Object.keys(selectedAnswers).length > 0}
          onContinue={() => setShowExitDialog(false)}
          onExit={() => navigate(`/practice/company/${slug}`)}
          onViewResults={() => handleFinishQuiz(true)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-4 gap-4 relative z-10">
        {/* Question card with footer */}
        <div className="w-full min-h-[350px] sm:min-h-[400px] max-w-[700px] bg-white dark:bg-surface border-1 border-dashed border-gray-200 dark:border-border p-4 sm:p-6 flex flex-col gap-3">
          {/* Subtopic & Difficulty - Mobile visible */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-xs font-medium text-text-muted">{company?.name}</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-medium text-text-muted capitalize">{categoryDisplayNames[categorySlug]}</span>
          </div>

          <p className="text-xs font-bold tracking-[0.08em] text-text-muted uppercase m-0">
            QUESTION {currentIndex + 1} OF {total}
          </p>

          <p className="text-base font-medium text-text-strong leading-relaxed m-0">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {[currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d].map((option, i) => {
              const isCorrect = isCorrectOption(option);
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

            {!questionResolved[currentIndex] && (
              <button
                onClick={handleShowAnswer}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-dashed border-text-muted text-text-muted hover:bg-surface-2 t-interactive"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-text-strong hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-text-muted tabular-nums">
            {currentIndex + 1} / {total}
          </span>

          {isLastQuestion ? (
            <button
              onClick={() => handleFinishQuiz()}
              disabled={!hasAttemptedCurrentQuestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-accent-contrast bg-lime-400 hover:bg-lime-300 disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive"
            >
              Finish
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAttemptedCurrentQuestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-accent-ink hover:bg-surface disabled:opacity-[0.35] disabled:cursor-not-allowed t-interactive"
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
