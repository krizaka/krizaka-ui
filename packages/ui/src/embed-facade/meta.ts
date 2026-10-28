import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Embed facade",
  summary: "A platform's short video (TikTok, YouTube Shorts, Instagram) behind a button: until the visitor asks, no frame, no script and no platform picture is requested — the frame is added on the click, sandboxed.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A web page's embed; a native app opens the platform's own app or a link.", use: "video-player" }, desktop: "web" },
  whenToUse: [
    "A shop or a profile that shows its latest reel from a platform, where privacy law (Québec's Law 25) wants consent before anything third-party loads.",
    "Inside a `RetroTv`, as the television's screen.",
  ],
  whenNotToUse: [
    { when: "A video you host yourself: no facade is needed.", use: "video-player" },
    { when: "A plain link to a profile: an anchor with rel=\"noopener noreferrer\" loads nothing.", use: "chip-link" },
  ],
  bestPractices: [
    "Validate the address when the owner saves it, with the same `embedUrl(platform, url)` the page uses: it returns the frame's address, or `null` for another host, `http:`, a short link or a profile.",
    "Give a `poster` that is your own copy (your storage or CDN). A poster on a platform's domain (ytimg, tiktokcdn, cdninstagram…) is refused: it would be a request before the click.",
    "`playLabel` names the platform it loads (« Load TikTok and play ») and `notice` says what the platform receives; both are translated by the host.",
    "The frame needs the host's Content-Security-Policy to allow `frame-src` for the three platforms; nothing else is loaded.",
    "Inside a television's screen it fills its parent; alone, it takes `aspectRatio` (9 / 16 by default).",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter / Space", action: "Reaches the one button and loads the video; focus moves to the frame." }],
    notes: [
      "A group named by `title`, one native button (44 px at least) that says the platform; the frame carries the same title.",
      "The poster is decorative (empty alt). No motion, so nothing changes under reduced motion.",
    ],
  },
  related: ["retro-tv", "video-player", "vertical-video"],
  web: {
    imports: ["EmbedFacade", "embedUrl", "isOwnPoster", "EMBED_PLATFORMS"],
    examples: [
      { name: "youtube", title: "YouTube Shorts", description: "The gate with the host's own poster and a notice; the frame appears on the click." },
      { name: "tiktok", title: "TikTok, in French", description: "The same facade without a poster; every word is the host's." },
    ],
  },
} satisfies ComponentMeta;
