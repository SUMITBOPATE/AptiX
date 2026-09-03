export default function ExitQuizDialog({ onContinue, onExit, onViewResults, hasAttempts }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="exit-title" className="w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-card dark:bg-surface">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">!</div>
        <h2 id="exit-title" className="mt-4 text-lg font-bold text-text-strong">Exit this test?</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-text">Are you sure you want to leave? You can view results for the questions attempted so far.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onViewResults} disabled={!hasAttempts} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#17210a]">View Attempted Results</button>
          <button type="button" onClick={onExit} className="w-full rounded-xl border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-red-50 dark:hover:bg-red-500/10">Yes, Exit Test</button>
          <button type="button" onClick={onContinue} autoFocus className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-strong hover:bg-surface-2">No, Continue Test</button>
        </div>
      </div>
    </div>
  );
}
