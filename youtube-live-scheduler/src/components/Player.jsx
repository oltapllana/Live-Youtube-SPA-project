export default function Player({ program, simMinute }) {
  if (!program?.videoId) {
    return (
      <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-sky-900 flex flex-col items-center justify-center text-slate-300 shadow-inner ring-1 ring-white/10">
        <div className="w-12 h-12 mb-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-widest uppercase opacity-50">
          No Broadcast on this channel
        </span>
      </div>
    );
  }

  const elapsedMinutes = simMinute - program.raw_start;
  const startSeconds = Math.max(0, elapsedMinutes * 60);

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 relative">
      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
        Live
      </div>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${program.videoId}?autoplay=1&mute=1&controls=1&rel=0&start=${startSeconds}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="YouTube Player"
      />
    </div>
  );
}