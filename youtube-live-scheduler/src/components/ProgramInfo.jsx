import { genreToIcon } from "../utils/genre";

export default function ProgramInfo({ program }) {
  if (!program) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-slate-400">
        No program playing
      </div>
    );
  }

  const now = new Date();
  const elapsed = now - program.startDate;
  const total = program.endDate - program.startDate;
  const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));

  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl shrink-0">{genreToIcon(program.genre)}</div>

          <div className="min-w-0">
            <div className="font-semibold truncate">{program.channel_name}</div>
            <div className="text-xs text-slate-400">
              {program.genre || "Program"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>
          {program.startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" – "}
          {program.endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <span>{percent.toFixed(0)}%</span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
