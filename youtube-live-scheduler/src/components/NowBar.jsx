export default function NowBar({ program }) {
  if (!program) {
    return (
      <div className="self-start rounded-full bg-white/5 backdrop-blur border border-white/10 px-4 py-2 text-sm text-slate-400">
        Nothing playing
      </div>
    );
  }

  const startStr = program.startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endStr = program.endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalMs = program.endDate - program.startDate;
  const elapsedMs = Date.now() - program.startDate.getTime();
  const percent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-3 space-y-2 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE • {program.channel_name}</span>
        </div>

        <span className="text-xs text-slate-400">
          {startStr} – {endStr}
        </span>
      </div>

      <div className="text-xs text-slate-400">{program.genre || "Program"}</div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
