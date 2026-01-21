export default function Header({
  fullTimeline,
  selectedChannel,
  filterTimelineByChannel,
  loadInstance,
  onImportClick,
  channelsList = [],
}) {
  const channels = ["all", ...channelsList.map(c => c.channel_name)];

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/5 backdrop-blur border-b border-white/10">
      <div className="flex items-center gap-3">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill="#FF0000"
            d="M23.498 6.186a2.958 2.958 0 00-2.08-2.09C19.617 3.5 12 3.5 12 3.5s-7.617 0-9.418.596a2.958 2.958 0 00-2.08 2.09A30.066 30.066 0 000 12a30.066 30.066 0 00.502 5.814 2.958 2.958 0 002.08 2.09C4.383 20.5 12 20.5 12 20.5s7.617 0 9.418-.596a2.958 2.958 0 002.08-2.09A30.066 30.066 0 0024 12a30.066 30.066 0 00-.502-5.814z"
          />
          <path fill="#FFFFFF" d="M9.75 15.02L15.5 12 9.75 8.98v6.04z" />
        </svg>

        <span className="text-lg font-semibold tracking-wide">
          YouTube Live Scheduler
        </span>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedChannel}
          onChange={(e) => filterTimelineByChannel(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm bg-sky-900/40 border border-sky-300/20 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
        >
          {channels.map((ch) => (
            <option key={ch} value={ch} className="bg-slate-900">
              {ch === "all" ? "All Channels" : ch}
            </option>
          ))}
        </select>
        <button
          onClick={loadInstance}
          className="h-9 px-4 rounded-lg text-sm font-medium bg-sky-500/90 hover:bg-sky-400 text-slate-900 transition shadow-sm"
        >
          Refresh
        </button>
        <button
          onClick={onImportClick}
          className="h-9 px-4 rounded-lg text-sm font-medium bg-purple-500/90 hover:bg-purple-400 text-slate-900 transition shadow-sm"
        >
          Import Instance
        </button>
      </div>
    </header>
  );
}
