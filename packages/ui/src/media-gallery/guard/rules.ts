// The rules of the media guard (ADR-010 §4), as pure functions over what ffprobe / ffmpeg measured. No I/O here: the
// measures come through a `MediaPort` (`./ffmpeg` builds one from a command runner), so every rule is tested on numbers.

// @fixed: encoder rounding — a frame may be off 16:9 by this much in |w·9 − h·16| (1280×720 and 1920×1080 are exact).
export const RATIO_TOLERANCE = 16;
// @fixed: a band is « black » under this peak luma (0–255).
export const BLACK_PEAK = 24;
// @fixed: the middle of a frame is a picture over this peak luma.
export const PICTURE_PEAK = 60;
// @fixed: a last frame whose average luma is under this is a black end card, not a picture.
export const DARK_LAST_FRAME = 6;
// @fixed: a declared duration may differ from the file's by this many seconds (the last frame's rounding).
export const DURATION_TOLERANCE = 0.25;

/** What a carousel slide says about its files: the guard checks that it says the truth. */
export type GuardSlide = { id: string; src: string; video?: { webm?: string; mp4?: string }; audio?: boolean; duration?: number };

/** The kinds of stream ffprobe reports that the guard reads. */
export const StreamKind = { Video: "video", Audio: "audio", Other: "other" } as const;
export type StreamKind = (typeof StreamKind)[keyof typeof StreamKind];
export type StreamFacts = { kind: StreamKind; codec: string; width?: number; height?: number; pixFmt?: string };
export type FileFacts = { streams: StreamFacts[]; duration?: number };
/** One sampled frame's peak luma in six bands: the side bars, the top and bottom bands, and the middles they frame. */
export type FrameBands = { left: number; right: number; centre: number; top: number; bottom: number; middle: number };

/** The measures the guard needs, one file at a time (an HTTP client and ffprobe / ffmpeg in the bin; fakes in tests). */
export type MediaPort = {
  head: (url: string) => Promise<{ status: number; contentType: string }>;
  facts: (url: string) => Promise<FileFacts>;
  bands: (url: string) => Promise<FrameBands[]>;
  lastFrameLuma: (url: string) => Promise<number>;
  firstBytes: (url: string) => Promise<Uint8Array>;
};

const EXPECTED = {
  mp4: { type: "video/mp4", codec: "h264", pixFmt: "yuv420p" },
  webm: { type: "video/webm", codec: "vp9" },
} as const;

/** Is a width and height a 16:9, within the encoder's rounding? */
export const isSixteenNine = (width: number, height: number) => width > 0 && height > 0 && Math.abs(width * 9 - height * 16) <= RATIO_TOLERANCE;

/** The frames that are a picture between two black side bars (a vertical reel in a wide file). */
export const pillarboxed = (frames: readonly FrameBands[]) => frames.filter((f) => f.left < BLACK_PEAK && f.right < BLACK_PEAK && f.centre > PICTURE_PEAK);

/** The frames that are a picture between a black top and bottom band (a wider picture in a 16:9 file). */
export const letterboxed = (frames: readonly FrameBands[]) => frames.filter((f) => f.top < BLACK_PEAK && f.bottom < BLACK_PEAK && f.middle > PICTURE_PEAK);

/** Is the average luma of the last frame a black end card? */
export const blackEndCard = (luma: number) => luma < DARK_LAST_FRAME;

const box = (bytes: Uint8Array, at: number) => ({
  size: ((bytes[at]! << 24) >>> 0) + (bytes[at + 1]! << 16) + (bytes[at + 2]! << 8) + bytes[at + 3]!,
  type: String.fromCodePoint(bytes[at + 4]!, bytes[at + 5]!, bytes[at + 6]!, bytes[at + 7]!),
});

/** Walks an MP4's top-level boxes: `true` when `moov` comes before `mdat` (it plays before it is downloaded), `false` after, `undefined` if the bytes do not tell. */
export function fastStart(bytes: Uint8Array): boolean | undefined {
  let at = 0;
  while (at + 8 <= bytes.length) {
    const { size, type } = box(bytes, at);
    if (type === "moov") return true;
    if (type === "mdat") return false;
    if (size < 8) return undefined;
    at += size;
  }
  return undefined;
}

/** What is wrong with one encode of a slide's clip, as sentences (empty: fine). */
export function encodeProblems(name: string, ext: "mp4" | "webm", facts: FileFacts, slide: GuardSlide): string[] {
  const problems: string[] = [];
  const video = facts.streams.find((s) => s.kind === StreamKind.Video);
  if (!video) return [`${name}.${ext}: no video stream`];
  const expected = EXPECTED[ext];
  if (video.codec !== expected.codec) problems.push(`${name}.${ext}: codec ${video.codec}, expected ${expected.codec}`);
  if ("pixFmt" in expected && video.pixFmt && video.pixFmt !== expected.pixFmt) problems.push(`${name}.${ext}: pixel format ${video.pixFmt}, Safari needs ${expected.pixFmt}`);
  if (!isSixteenNine(video.width ?? 0, video.height ?? 0)) problems.push(`${name}.${ext}: ${video.width}x${video.height} is not 16:9`);
  const hasAudio = facts.streams.some((s) => s.kind === StreamKind.Audio);
  if (hasAudio !== Boolean(slide.audio)) problems.push(`${name}.${ext}: ${hasAudio ? "has" : "has no"} audio track, the slide says audio: ${Boolean(slide.audio)}`);
  if (slide.duration !== undefined && facts.duration !== undefined && Math.abs(slide.duration - facts.duration) > DURATION_TOLERANCE)
    problems.push(`${name}.${ext}: lasts ${facts.duration.toFixed(2)} s, the slide says ${slide.duration} s`);
  return problems;
}

/** What is wrong with what a clip shows, as sentences (empty: fine). */
export function pictureProblems(name: string, frames: readonly FrameBands[], lastLuma: number): string[] {
  const problems: string[] = [];
  const pillars = pillarboxed(frames).length;
  if (pillars > 0) problems.push(`${name}: ${pillars} frame(s) are a picture between black side bars (pillarbox)`);
  const letters = letterboxed(frames).length;
  if (letters > 0) problems.push(`${name}: ${letters} frame(s) are a picture between black top and bottom bands (letterbox)`);
  if (blackEndCard(lastLuma)) problems.push(`${name}: the last frame is black (an end card)`);
  return problems;
}

/** The type a URL must answer with. */
export const expectedType = (url: string) => (/\.webm(\?|$)/.test(url) ? EXPECTED.webm.type : /\.mp4(\?|$)/.test(url) ? EXPECTED.mp4.type : "image/");
