import { useState } from 'react';
import { useParams, useNavigate } from 'react';

export default function PracticeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // 1. Controlled state for the select dropdown, defaulting to URL param or 'tcs-nqt'
  const [selectedExam, setSelectedExam] = useState(examId || 'tcs-nqt');

  const handleStartPractice = () => {
    // 2. Client-side navigation without full page reload
    navigate(`/practice/${selectedExam}`);
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-[2px] w-6 bg-lime-500" />
        <h2 className="font-semibold text-sm uppercase tracking-[0.2em] text-lime-600">
          Practice Popular Exams
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900">
            {selectedExam === 'tcs-nqt' ? 'TCS NQT' : 'Practice'} — Practice Set
          </h3>
          <p className="text-gray-600 text-sm mt-1 max-w-xl">
            Practice curated, high-frequency questions with timed and untimed modes. Start a mock or targeted practice by topic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Select exam"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            <option value="tcs-nqt">TCS NQT</option>
            <option value="accenture">Accenture</option>
            <option value="wipro">Wipro NLTH</option>
          </select>

          <button
            onClick={handleStartPractice}
            className="px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-gray-950 font-bold text-sm rounded-lg shadow-sm transition-all hover:scale-[1.02]"
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}
