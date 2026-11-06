// krizaka-media-guard <slides.json> [--base <url>] [--json] — runs the media guard (ADR-010 §4) on a carousel's real files.
// slides.json: an array of { id, src, video: { webm, mp4 }, audio, duration } (relative URLs resolved against --base).
// Needs ffprobe and ffmpeg on the PATH and the network. Exit 1 when a file is unfit; --json prints the measured lengths and audio.
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

import { ffmpegPort } from "./ffmpeg";
import { guardSlides } from "./guard";
import type { GuardSlide } from "./rules";

// @fixed: ffmpeg reads a remote clip; a stalled one is reported after two minutes.
const TOOL_TIMEOUT_MS = 120_000;

const args = process.argv.slice(2);
const option = (flag: string) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--base");
if (!file) {
  console.error("usage: krizaka-media-guard <slides.json> [--base <url>] [--json]");
  process.exit(2);
}
const base = option("--base");
const at = (url: string) => (base ? new URL(url, base).href : url);
const slides = (JSON.parse(await readFile(file, "utf8")) as GuardSlide[]).map((s) => ({
  ...s,
  src: at(s.src),
  video: s.video && { webm: s.video.webm && at(s.video.webm), mp4: s.video.mp4 && at(s.video.mp4) },
}));
const run = (command: string, list: readonly string[]) => execFileSync(command, list, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: TOOL_TIMEOUT_MS, maxBuffer: 1 << 26 });
const report = await guardSlides(slides, ffmpegPort(run));
if (args.includes("--json")) console.log(JSON.stringify(report, null, 2));
if (report.problems.length > 0) {
  console.error(report.problems.join("\n"));
  process.exitCode = 1;
} else if (!args.includes("--json")) {
  console.log(`media guard: ${slides.length} slide(s) fit for a carousel — 16:9, clean frames, Safari and Chrome encodes, truthful audio`);
}
