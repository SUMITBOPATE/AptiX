import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Layout from './layouts/Layout';
import Hero from './pages/Hero';
import Topics from './pages/Topics';
import SubtopicPage from './pages/SubtopicPage';
import QuizPage from './pages/QuizPage';
import { HugeiconsIcon } from '@hugeicons/react';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen selection:bg-gray-900 selection:text-white bg-white overflow-hidden">
      {/* === SLANTED EDGE RAILS (2rem) === */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-full w-10  border-x-1 border-dashed border-gray-200 slanted-rail-left z-1" />
        <div className="absolute right-0 top-0 h-full  border-x-1 border-dashed border-gray-200  w-10 slanted-rail-right" />
      </div>

      {/* === APP CONTENT === */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<><Hero /><Topics /></>} />
          <Route path="practice/:topicSlug" element={<SubtopicPage />} />
        </Route>
        {/* Quiz runs fullscreen with its own header */}
        <Route path="practice/:topicSlug/quiz" element={<QuizPage />} />
      </Routes>
    </div>
  );
}


export default App;
