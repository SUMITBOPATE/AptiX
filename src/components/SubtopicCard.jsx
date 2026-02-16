import ChevronRight from '../icons/ChevronRight';

const SubtopicCard = ({ subtopic }) => {
  const { name, slug, description, icon, questionCount, questions } = subtopic;
  const totalQuestions = typeof questionCount === 'number' ? questionCount : (questions ? (questions.easy || 0) + (questions.medium || 0) + (questions.hard || 0) : 10);

  return (
    <div>
      <div
        key={slug}
        className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer overflow-hidden hover:bg-gray-50 transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-4xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
            {icon}
          </div>

          <div className="flex-1 min-w-0 relative">
            <h3 className="text-base font-semibold text-gray-900 leading-tight truncate pr-12">
              {name}
            </h3>
            <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-4xl bg-lime-200 text-xs font-medium text-gray-600">
              0/{totalQuestions}
            </span>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
              {description}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-lime-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-lime-600 transition-colors" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-indigo-50/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
      </div>
    </div>
  );
};

export default SubtopicCard;
