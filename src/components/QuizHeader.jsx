import { useNavigate } from 'react-router-dom';
import ArrowLeft from '../icons/ArrowLeft';

function BookmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export default function QuizHeader({ currentIndex, totalQuestions, timer, score, subtopicName, difficulty }) {
  const navigate = useNavigate();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-10 h-14 border-b border-dashed border-gray-200 bg-white sticky top-0 z-20">

      {/* Left: Topic badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-text-strong text-sm font-medium border border-border rounded-lg px-2 sm:px-3 py-1.5 cursor-pointer bg-transparent hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>

        {/* Topic & Difficulty badge */}
        {(subtopicName || difficulty) && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-muted bg-gray-100 border border-dashed border-gray-200 rounded-lg px-2.5 py-1.5">
            <span>{subtopicName}</span>
            <span className="text-gray-300">•</span>
            <span className="capitalize">{difficulty}</span>
          </div>
        )}
      </div>

      {/* Center: Progress dots */}
      <div className="flex items-center gap-1.5 border border-border rounded-full px-3.5 py-1.5">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const dotClass =
            i < currentIndex
              ? 'bg-primary-strong opacity-50'
              : i === currentIndex
              ? 'bg-primary'
              : 'bg-transparent border-[1.5px] border-border';
          return <span key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${dotClass}`} />;
        })}
      </div>

      {/* Right: Timer, Score, Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-text-strong">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="tabular-nums">{formatTime(timer)}</span>
        </div>

        <div className="w-px h-5 bg-border" />

        <div className="text-sm font-semibold text-text-strong min-w-5 text-center">{score}</div>

        <div className="w-px h-5 bg-border" />

        <button className="flex items-center p-1 rounded-md text-text-muted cursor-pointer bg-transparent border-none hover:text-text-strong hover:bg-surface transition-all">
          <BookmarkIcon />
        </button>
        <button className="flex items-center p-1 rounded-md text-text-muted cursor-pointer bg-transparent border-none hover:text-text-strong hover:bg-surface transition-all">
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
}
