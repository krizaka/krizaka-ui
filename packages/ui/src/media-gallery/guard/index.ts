/** @krizaka/ui/media-guard — the media guard of `MediaCarousel` (ADR-010 §4): `guardSlides(slides, port)` checks a carousel's real files (16:9 by pixels, H.264 yuv420p fast start + VP9, no pillarbox / letterbox, no black end card, a truthful `audio` and `duration`); `ffmpegPort(run)` measures with ffprobe / ffmpeg; the bin `krizaka-media-guard` runs it. Node, no React. */
export { ffmpegPort, parseProbe, type Run, statValues } from "./ffmpeg";
export { type GuardReport, guardSlides, type Measured } from "./guard";
export {
  blackEndCard,
  encodeProblems,
  fastStart,
  type FileFacts,
  type FrameBands,
  type GuardSlide,
  isSixteenNine,
  letterboxed,
  type MediaPort,
  pictureProblems,
  pillarboxed,
  type StreamFacts,
  StreamKind,
} from "./rules";
