import { Routes, Route } from 'react-router-dom';

import Layout from './layouts/Layout';
import Hero from './pages/Hero';
import Topics from './pages/Topics';
import SubtopicPage from './pages/SubtopicPage';
import QuizPage from './pages/QuizPage';
import PracticeExamPage from './pages/PracticeExamPage';
import CompanyPractice from './pages/CompanyPractice';
import CompanyQuizPage from './pages/CompanyQuizPage';
import MockTestPage from './pages/MockTestPage';
import './App.css';


function App() {
  const handleShowTopics = () => {
    const element = document.getElementById('topics-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="theme-page relative min-h-screen selection:bg-gray-900 selection:text-white bg-bg overflow-hidden">
      {/* === SLANTED EDGE RAILS (2rem) - Desktop only === */}
      <div className="hidden md:block pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-0 top-0 h-full w-10 border-l-[1.8px] border-r-[1.8px] border-dashed border-gray-200 dark:border-white/[0.05] slanted-rail-left" />
        <div className="absolute right-0 top-0 h-full w-10 border-l-[1.8px] border-r-[1.8px] border-dashed border-gray-200 dark:border-white/[0.05] slanted-rail-right" />
      </div>

      {/* === APP CONTENT === */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<><Hero onShowTopics={handleShowTopics} /><Topics /></>} />
        </Route>
        {/* Practice pages without navbar/footer */}
          <Route path="practice/exam/:examId" element={<PracticeExamPage />} />
        <Route path="practice/company/:slug" element={<CompanyPractice />} />
        <Route path="practice/company/:slug/:categorySlug/quiz" element={<CompanyQuizPage />} />
        <Route path="practice/mock-test" element={<MockTestPage />} />
        <Route path="practice/mock-test/quiz" element={<QuizPage />} />
        <Route path="practice/:topicSlug" element={<SubtopicPage />} />
        <Route path="practice/:topicSlug/quiz" element={<QuizPage />} />
      </Routes>
    </div>
  );
}


export default App;
