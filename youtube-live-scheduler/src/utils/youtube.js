export function extractVideoId(url) {
  if (!url) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.has("v")) return u.searchParams.get("v");

      const parts = u.pathname.split("/");
      return parts[parts.length - 1];
    }
  } catch (e) {

  }

  const match = url.match(/[a-zA-Z0-9_-]{11}/);
  return match ? match[0] : null;
}
