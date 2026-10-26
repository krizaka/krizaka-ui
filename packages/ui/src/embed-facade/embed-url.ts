// The pure part of the facade (krizaka-ui#605): which addresses may ever be embedded, and what the frame's address is.
// Nothing here touches the network or the DOM, so a server (the shop's editor) can validate with the same function the page uses.

/** The platforms a facade can load after a click. */
export type EmbedPlatform = "tiktok" | "youtube-shorts" | "instagram";

/** The platforms' names, as proper nouns (they are not translated). */
export const EMBED_PLATFORMS: Readonly<Record<EmbedPlatform, string>> = Object.freeze({ tiktok: "TikTok", "youtube-shorts": "YouTube Shorts", instagram: "Instagram" });

const TIKTOK_HOSTS = ["tiktok.com", "www.tiktok.com"];
const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com"];
const INSTAGRAM_HOSTS = ["instagram.com", "www.instagram.com"];

/** Every host a platform's frame or picture lives on: a poster served from one of them would be a request before the click. */
const PLATFORM_DOMAINS = ["tiktok.com", "tiktokcdn.com", "tiktokcdn-us.com", "youtube.com", "youtu.be", "youtube-nocookie.com", "ytimg.com", "googlevideo.com", "instagram.com", "cdninstagram.com", "fbcdn.net", "facebook.com"];

function parse(url: string): URL | null {
  try {
    const u = new URL(url);
    // https only, no credentials, no port: the address is a public post, nothing else.
    if (u.protocol !== "https:" || u.username || u.password || u.port) return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * The address of the platform's frame for a public post, or `null` for anything else: another host, `http:`, a short
 * link we cannot resolve without asking the platform, a profile page. Exact hosts, exact paths.
 */
export function embedUrl(platform: EmbedPlatform, url: string): string | null {
  const u = parse(url);
  if (!u) return null;
  const host = u.hostname.toLowerCase();
  if (platform === "tiktok") {
    const id = TIKTOK_HOSTS.includes(host) ? /^\/@[\w.-]{1,64}\/video\/(\d{8,25})\/?$/.exec(u.pathname)?.[1] : undefined;
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  }
  if (platform === "youtube-shorts") {
    const id = YOUTUBE_HOSTS.includes(host) ? /^\/shorts\/([\w-]{11})\/?$/.exec(u.pathname)?.[1] : host === "youtu.be" ? /^\/([\w-]{11})\/?$/.exec(u.pathname)?.[1] : undefined;
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  const match = INSTAGRAM_HOSTS.includes(host) ? /^\/(?:[\w.]{1,30}\/)?(p|reel|reels|tv)\/([\w-]{5,40})\/?$/.exec(u.pathname) : null;
  return match ? `https://www.instagram.com/${match[1] === "reels" ? "reel" : match[1]}/${match[2]}/embed` : null;
}

/** Whether a poster may be drawn before the click: a path of the host's own origin, or an https picture that is not on a platform's domain (the host copies it to its own storage). */
export function isOwnPoster(poster: string): boolean {
  if (poster.startsWith("/") && !poster.startsWith("//")) return true;
  const u = parse(poster);
  if (!u) return false;
  const host = u.hostname.toLowerCase();
  return !PLATFORM_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}
