import { genreToIcon } from "../utils/genre";

export default function MiniGuide({ timeline, now }) {
  if (!timeline.length) {
    return (
      <aside className="p-4 rounded-2xl bg-white/5 backdrop-blur text-slate-400">
        No schedule loaded
      </aside>
    );
  }

  const active = timeline.find((p) => now >= p.startDate && now < p.endDate);
  const next = timeline.find((p) => p.startDate > now);
  const later = timeline
    .filter((p) => p.startDate > now && p !== next)
    .slice(0, 3);

  const items = [];
  if (active) items.push({ label: "Now", p: active });
  if (next) items.push({ label: "Next", p: next });
  later.forEach((p) => items.push({ label: "Later", p }));

  return (
    <aside className="space-y-4">
      {/* TITLE */}
      <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
        Schedule
      </h2>

      {items.map(({ label, p }, idx) => {
        const cardStyle =
          label === "Now"
            ? "bg-emerald-500/15 border-emerald-400/40"
            : label === "Next"
            ? "bg-sky-500/15 border-sky-400/40"
            : "bg-white/5 border-white/10 hover:bg-white/10";

        return (
          <div
            key={idx}
            className={`flex gap-3 p-3 rounded-xl border transition ${cardStyle}`}
          >
            {p.videoId && (
              <img
                src={`https://img.youtube.com/vi/${p.videoId}/mqdefault.jpg`}
                alt=""
                className="w-20 h-12 rounded-md object-cover shrink-0"
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate">
                  {label}: {p.channel_name}
                </span>
                <span className="text-xs text-slate-400 ml-2 shrink-0">
                  {p.startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-0.5">
                {genreToIcon(p.genre)} {p.genre}
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
