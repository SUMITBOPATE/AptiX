import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import Dialog from '../components/quiz/Dailog';

const mockTest = {
  name: 'Mixed Mock Test',
  slug: 'mock-test',
  description: 'A randomized mix of quantitative, reasoning, and verbal questions.',
  icon: 'M',
};

export default function MockTestPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleStart = (config) => {
    navigate('/practice/mock-test/quiz', {
      state: { ...config, isMockTest: true },
    });
  };

  return (
    <div className="theme-page min-h-screen p-4 pt-6 text-gray-800 dark:text-text">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-600 dark:text-text hover:text-lime-600 transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-1" /> Back
        </button>
        <div className="mt-6 bg-white dark:bg-surface border border-gray-200 dark:border-border rounded-xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-lime-600 dark:text-lime-400">Mock test</p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-text-strong">Mixed aptitude practice</h1>
          <p className="mt-2 max-w-xl text-gray-600 dark:text-text">
            Configure your question count and difficulty, then attempt a randomized set drawn from every category.
          </p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-lime-400 text-slate-950 font-semibold hover:bg-lime-300 transition-colors"
          >
            Configure mock test
          </button>
        </div>
      </div>

      {isDialogOpen && (
        <Dialog
          selectedSubtopic={mockTest}
          onClose={() => setIsDialogOpen(false)}
          onStart={handleStart}
          totalQuestions={50}
        />
      )}
    </div>
  );
}
