import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getQuestions } from '../lib/supabase';
import { companiesData } from '../../data/companies';
import { COPY } from '../lib/copy';
import { selectByDifficulty } from '../lib/difficulty';
import { getQuestionOptions, getCorrectOptionText, isCorrectOption } from '../lib/answers';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizNav from '../components/quiz/QuizNav';
import QuizQuestion from '../components/quiz/QuizQuestion';
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
  // questions as Easy. Order matters too: select by difficulty first, then take
  // the requested number. The old code sliced inside the fetch and filtered
  // afterwards, so asking for 10 Medium questions could return nothing even when
  // the company had dozens.
  const filteredQuestions = selectByDifficulty(
    getUniqueQuestions(allQuestions),
    selectedDifficulty,
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
          <p>{COPY.noQuestions}</p>
          <BackButton onClick={() => navigate(-1)} label={COPY.goBack} />
        </div>
      </div>
    );
  }

  const handleSelect = (option) => {
    // If question is already resolved, don't allow more selections
    if (questionResolved[currentIndex]) return;

    // If this is the correct answer
    if (isCorrectOption(option, currentQuestion)) {
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
        <LoadingState label={COPY.loadingQuestions} className="flex-1" />
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>{COPY.loadFailed}</p>
          <BackButton onClick={() => navigate(`/practice/company/${slug}`)} label={COPY.goBack} />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>{COPY.noQuestions}</p>
          <BackButton onClick={() => navigate(`/practice/company/${slug}`)} label={COPY.goBack} />
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
        <QuizQuestion
          question={currentQuestion}
          currentIndex={currentIndex}
          total={total}
          metaLabels={[company?.name, categoryDisplayNames[categorySlug]]}
          selectedAnswer={selectedAnswers[currentIndex]}
          attemptedOptions={attemptedAnswers[currentIndex] ?? []}
          isResolved={Boolean(questionResolved[currentIndex])}
          showAnswer={showAnswer}
          onSelect={handleSelect}
          onShowAnswer={handleShowAnswer}
          explanation={currentQuestion.explanation}
          showExplanation={showExplanation}
          onToggleExplanation={() => setShowExplanation(!showExplanation)}
        />
      </main>


      <QuizNav
        currentIndex={currentIndex}
        total={total}
        isLastQuestion={isLastQuestion}
        canAdvance={hasAttemptedCurrentQuestion}
        onPrev={handlePrev}
        onNext={handleNext}
        onFinish={() => handleFinishQuiz()}
      />
    </div>
  );
}
