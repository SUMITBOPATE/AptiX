// User-facing copy that appears in more than one place.
//
// The same strings used to be typed into each component that needed them, which
// is how "Loading questions" ended up spelled three ways and the nav links in
// the navbar and footer drifted apart. Anything said to the user lives here so
// there is one place to change it.

export const COPY = {
  loadingQuestions: 'Loading questions',
  loadFailed: 'Could not load questions. Check your connection and try again.',
  noQuestions: 'No questions found for this configuration.',
  goBack: 'Go Back',
  back: 'Back',

  showAnswer: 'Show Answer',
  explanation: 'Explanation',
  correct: '✓ Correct!',
  incorrect: (answer) => `✗ Incorrect — Answer: ${answer}`,

  startLearning: 'Start Learning',
  tryMockTest: 'Try a Mock Test',
  mixedMockTest: 'Mixed Mock Test',
  startPractice: 'Start Practice',
  comingSoon: 'Coming Soon',
  launchSimulation: 'Launch Simulation',
  retryQuiz: 'Retry Quiz',
  backToTopics: 'Back to Topics',
};

// Nav destinations, so the navbar and the footer cannot disagree about them.
export const NAV_LINKS = [
  { label: 'Practice', target: 'topics-section' },
  { label: 'Mock Test', target: 'mock-test-section' },
  { label: 'Companies', target: 'companies-section' },
];
