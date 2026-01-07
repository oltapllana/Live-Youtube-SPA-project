export function genreToIcon(genre) {
  if (!genre) return "📺";

  const g = genre.toLowerCase();

  if (g.includes("news")) return "📰";
  if (g.includes("kids")) return "👶";
  if (g.includes("game")) return "🎮";
  if (g.includes("drama")) return "🎭";
  if (g.includes("talk")) return "🎙️";

  return "📺";
}
