import { type FileFacts, type FrameBands, type MediaPort, type StreamFacts, StreamKind } from "./rules";

/** Runs a command and returns its standard output (the bin passes `execFileSync`; tests pass a fake). */
export type Run = (command: string, args: readonly string[]) => string;

const CROPS = {
  left: "iw*0.2:ih:0:0",
  right: "iw*0.2:ih:iw*0.8:0",
  centre: "iw*0.3:ih:iw*0.35:0",
  top: "iw:ih*0.12:0:0",
  bottom: "iw:ih*0.12:0:ih*0.88",
  middle: "iw:ih*0.3:0:ih*0.35",
} as const;

const KINDS: Record<string, StreamFacts["kind"]> = { video: StreamKind.Video, audio: StreamKind.Audio };

/** ffprobe's JSON (`-show_entries stream=…:format=duration -of json`) as the guard's facts. */
export function parseProbe(json: string): FileFacts {
  const raw = JSON.parse(json) as { streams?: Record<string, unknown>[]; format?: { duration?: string } };
  const streams = (raw.streams ?? []).map((s) => ({
    kind: KINDS[String(s.codec_type)] ?? StreamKind.Other,
    codec: String(s.codec_name ?? ""),
    width: typeof s.width === "number" ? s.width : undefined,
    height: typeof s.height === "number" ? s.height : undefined,
    pixFmt: typeof s.pix_fmt === "string" ? s.pix_fmt : undefined,
  }));
  const duration = raw.format?.duration ? Number.parseFloat(raw.format.duration) : undefined;
  return { streams, duration: Number.isFinite(duration) ? duration : undefined };
}

/** The values of one signalstats key printed by ffmpeg's `metadata=print`, in frame order. */
export const statValues = (out: string, key: string) =>
  out
    .split(`${key}=`)
    .slice(1)
    .map((chunk) => Number.parseFloat(chunk));

/** A `MediaPort` on ffprobe and ffmpeg (both on the PATH) and `fetch`. */
export function ffmpegPort(run: Run, fetcher: typeof fetch = fetch): MediaPort {
  const stat = (url: string, crop: string, key: string) =>
    statValues(run("ffmpeg", ["-v", "error", "-i", url, "-vf", `fps=5,crop=${crop},signalstats,metadata=print:key=lavfi.signalstats.${key}:file=-`, "-f", "null", "-"]), key);
  return {
    head: async (url) => {
      const r = await fetcher(url, { method: "HEAD" });
      return { status: r.status, contentType: r.headers.get("content-type") ?? "" };
    },
    facts: async (url) => parseProbe(run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,pix_fmt:format=duration", "-of", "json", url])),
    bands: async (url) => {
      const columns = Object.fromEntries(Object.entries(CROPS).map(([band, crop]) => [band, stat(url, crop, "YMAX")])) as Record<keyof FrameBands, number[]>;
      return columns.left.map((_, i) => Object.fromEntries(Object.keys(CROPS).map((band) => [band, columns[band as keyof FrameBands][i] ?? 0])) as FrameBands);
    },
    lastFrameLuma: async (url) =>
      statValues(run("ffmpeg", ["-v", "error", "-sseof", "-0.1", "-i", url, "-frames:v", "1", "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"]), "YAVG")[0] ?? 0,
    firstBytes: async (url) => {
      const r = await fetcher(url, { headers: { range: "bytes=0-65535" } });
      return new Uint8Array(await r.arrayBuffer());
    },
  };
}
