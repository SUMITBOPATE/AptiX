import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ArrowLeft from '../icons/ArrowLeft';
import { getQuestionsByDifficulty } from '../data/questions';

export default function PracticePage() {
   const navigate = useNavigate();
   const { topicSlug, subtopicSlug } = useParams();
   const [searchParams] = useSearchParams();
   const difficulty = searchParams.get('difficulty') || 'Adaptive AI Mode';



  const handleBack = () => {
    navigate(`/practice/${topicSlug}`);
  };
  const questions = getQuestionsByDifficulty(subtopicSlug, difficulty);

  return (
    <div className="min-h-screen flex-1 w-full p-4 pt-3 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <button  onClick={handleBack} className="inline-flex text-sm items-center text-gray-600 hover:text-green-600 transition-colors duration-200 mr-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-700 mt-4">
          {subtopicSlug} - {difficulty}
        </h1>

        <p className="text-gray-500 mt-2">
          {questions.length} questions
        </p>

        <div className="mt-6 space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-xl p-4 border border-gray-200">
                   <p className="font-medium">{index + 1}. {q.question}</p>
                       <div className="mt-2 space-y-1">
                       {q.options.map((opt, i) => (
                          <p key={i} className="text-gray-600 ml-4">
                         {String.fromCharCode(65 + i)}. {opt}
                    </p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions found for this subtopic.</p>
          )}
        </div>
      </div>
    </div>
  );
}
