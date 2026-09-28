import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMockQuestions, getQuestionsBySlug } from '../lib/supabase.js';
import { COPY } from '../lib/copy';
import { getQuestionOptions, getCorrectOptionText, isCorrectOption } from '../lib/answers';
import QuizHeader from '../components/quiz/QuizHeader.jsx';
import QuizNav from '../components/quiz/QuizNav.jsx';
import QuizQuestion from '../components/quiz/QuizQuestion.jsx';
import ResultComponent from "../components/quiz/ResultComponent.jsx"
import { getUniqueQuestions } from '../utils/questions.js';
import BackButton from '../components/ui/BackButton';
import ExitQuizDialog from '../components/quiz/ExitQuizDialog.jsx';

import LoadingState from '../components/ui/LoadingState';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicSlug } = useParams();
  const { state } = location;

  const { subtopic, selectedDifficulty, count, isMockTest = false } = state || {};

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let active = true;

    const requestedCount = count || 10;
    // Difficulty filtering still runs in JavaScript (see the note in
    // supabase.js about the difficulty column), so the database is asked for
    // extra rows. Applying a difficulty filter *after* a LIMIT would otherwise be
    // able to return fewer questions than the visitor asked for.
    const poolSize = Math.min(requestedCount * 3, 200);

    const fetchQuestions = async () => {
      setLoading(true);
      setLoadFailed(false);
      try {
        // Mock tests draw a random, balanced pool in the database. A topic quiz
        // asks for that subtopic's rows only, already filtered by category and
        // subcategory server-side.
        const questions = isMockTest
          ? await getMockQuestions({ count: requestedCount })
          : await getQuestionsBySlug(topicSlug, subtopic?.slug, poolSize);
        if (!active) return;
        setAllQuestions(questions);
      } catch (error) {
        // Both loaders rethrow on a Supabase error. Unhandled, the rejection
        // escaped and setLoading(false) never ran, so the quiz sat on its
        // spinner permanently with no way back.
        console.error('Unable to load questions:', error);
        if (active) setLoadFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchQuestions();
    return () => { active = false; };
  }, [topicSlug, subtopic?.slug, isMockTest, count]);

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
        options: getQuestionOptions(question),
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
          <BackButton onClick={() => navigate(-1)} label={COPY.goBack} />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text">
          <p>{COPY.noQuestions}</p>
          <BackButton onClick={() => navigate(-1)} label={COPY.goBack} />
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
        <QuizQuestion
          question={currentQuestion}
          currentIndex={currentIndex}
          total={total}
          metaLabels={[subtopic?.name, selectedDifficulty]}
          selectedAnswer={selectedAnswers[currentIndex]}
          attemptedOptions={attemptedAnswers[currentIndex] ?? []}
          isResolved={Boolean(questionResolved[currentIndex])}
          showAnswer={showAnswer}
          revealFeedback={!isMockTest}
          showAnswerHint={showAnswerHint}
          onSelect={handleSelect}
          onShowAnswer={handleShowAnswer}
          explanation={isMockTest ? null : currentQuestion.explanation}
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
