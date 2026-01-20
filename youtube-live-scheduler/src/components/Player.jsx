export default function Player({ program }) {
  if (!program?.videoId) {
    return (
      <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-sky-900 flex flex-col items-center justify-center text-slate-300 shadow-inner ring-1 ring-white/10">
        <span className="text-sm">No video playing</span>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${program.videoId}?autoplay=1&mute=1&controls=1&rel=0`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="YouTube Player"
      />
    </div>
  );
}
