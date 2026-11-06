import { encodeProblems, expectedType, fastStart, type GuardSlide, type MediaPort, pictureProblems, StreamKind } from "./rules";

/** What the guard measured on a slide: its length and whether it has sound, to write back into the slides' data. */
export type Measured = { id: string; duration?: number; audio: boolean };
export type GuardReport = { problems: string[]; measured: Measured[] };

async function httpProblems(name: string, url: string, port: MediaPort): Promise<string[]> {
  const { status, contentType } = await port.head(url);
  if (status !== 200) return [`${name}: ${url} answers HTTP ${status}`];
  const type = expectedType(url);
  return contentType.startsWith(type) ? [] : [`${name}: ${url} is ${contentType || "untyped"}, expected ${type}`];
}

async function slideReport(slide: GuardSlide, port: MediaPort): Promise<GuardReport> {
  const problems = await httpProblems(`${slide.id} poster`, slide.src, port);
  const encodes = (["webm", "mp4"] as const).filter((ext) => slide.video?.[ext]);
  if (slide.video && !slide.video.mp4) problems.push(`${slide.id}: no mp4 (H.264) — Safari plays no webm on iOS before 17.4`);
  let measured: Measured = { id: slide.id, audio: false };
  for (const ext of encodes) {
    const url = slide.video![ext]!;
    const http = await httpProblems(`${slide.id}.${ext}`, url, port);
    problems.push(...http);
    if (http.length > 0) continue;
    const facts = await port.facts(url);
    problems.push(...encodeProblems(slide.id, ext, facts, slide));
    measured = { id: slide.id, duration: facts.duration, audio: facts.streams.some((s) => s.kind === StreamKind.Audio) };
    if (ext === "mp4" && fastStart(await port.firstBytes(url)) === false) problems.push(`${slide.id}.mp4: moov after mdat — encode with -movflags +faststart`);
  }
  const picture = slide.video?.mp4 ?? slide.video?.webm;
  if (picture && problems.length === 0) problems.push(...pictureProblems(slide.id, await port.bands(picture), await port.lastFrameLuma(picture)));
  return { problems, measured: slide.video ? [measured] : [] };
}

/** Runs every rule of ADR-010 §4 on the slides' real files, through `port`. Empty `problems`: the files are fit for a carousel. */
export async function guardSlides(slides: readonly GuardSlide[], port: MediaPort): Promise<GuardReport> {
  const report: GuardReport = { problems: [], measured: [] };
  for (const slide of slides) {
    const one = await slideReport(slide, port);
    report.problems.push(...one.problems);
    report.measured.push(...one.measured);
  }
  return report;
}
