import { describe, expect, it } from "vitest";

import { ffmpegPort, parseProbe, statValues } from "./ffmpeg";
import { guardSlides } from "./guard";
import { blackEndCard, encodeProblems, fastStart, type FileFacts, type FrameBands, isSixteenNine, type MediaPort, pictureProblems } from "./rules";

// The bugs of 2026-11-05 (krizaka-internal#2651) as numbers: each one must be refused.
const clean: FrameBands = { left: 180, right: 170, centre: 200, top: 160, bottom: 150, middle: 210 };
const pillar: FrameBands = { ...clean, left: 3, right: 4 };
const letter: FrameBands = { ...clean, top: 2, bottom: 5 };
const mp4: FileFacts = { streams: [{ kind: "video", codec: "h264", width: 1280, height: 720, pixFmt: "yuv420p" }], duration: 8.04 };
const webm: FileFacts = { streams: [{ kind: "video", codec: "vp9", width: 1280, height: 720 }], duration: 8.04 };
const moovFirst = new Uint8Array([0, 0, 0, 16, ..."ftyp".split("").map((c) => c.charCodeAt(0)), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, ..."moov".split("").map((c) => c.charCodeAt(0))]);
const mdatFirst = new Uint8Array([0, 0, 0, 8, ..."mdat".split("").map((c) => c.charCodeAt(0))]);

describe("the rules", () => {
  it("knows a 16:9 by its pixels, within the encoder's rounding", () => {
    expect(isSixteenNine(1280, 720)).toBe(true);
    expect(isSixteenNine(1920, 1080)).toBe(true);
    expect(isSixteenNine(1920, 1088)).toBe(false);
    expect(isSixteenNine(720, 1280)).toBe(false);
    expect(isSixteenNine(1080, 1350)).toBe(false);
    expect(isSixteenNine(0, 0)).toBe(false);
  });

  it("refuses a vertical reel in a wide file, a letterbox and a black end card", () => {
    expect(pictureProblems("rag", [clean, pillar, pillar], 90)).toEqual(["rag: 2 frame(s) are a picture between black side bars (pillarbox)"]);
    expect(pictureProblems("w", [letter], 90)).toEqual(["w: 1 frame(s) are a picture between black top and bottom bands (letterbox)"]);
    expect(pictureProblems("duck", [clean], 2)).toEqual(["duck: the last frame is black (an end card)"]);
    expect(pictureProblems("ok", [clean], 90)).toEqual([]);
    expect(blackEndCard(5.9)).toBe(true);
  });

  it("asks Safari's encode and Chrome's, and a truthful audio flag and duration", () => {
    expect(encodeProblems("a", "mp4", mp4, { id: "a", src: "", duration: 8 })).toEqual([]);
    expect(encodeProblems("a", "webm", webm, { id: "a", src: "" })).toEqual([]);
    expect(encodeProblems("a", "mp4", { streams: [{ ...mp4.streams[0]!, codec: "hevc", pixFmt: "yuv444p" }] }, { id: "a", src: "" })).toEqual([
      "a.mp4: codec hevc, expected h264",
      "a.mp4: pixel format yuv444p, Safari needs yuv420p",
    ]);
    expect(encodeProblems("a", "mp4", mp4, { id: "a", src: "", audio: true })).toEqual(["a.mp4: has no audio track, the slide says audio: true"]);
    expect(encodeProblems("a", "mp4", { ...mp4, streams: [...mp4.streams, { kind: "audio", codec: "aac" }] }, { id: "a", src: "" })).toEqual([
      "a.mp4: has audio track, the slide says audio: false",
    ]);
    expect(encodeProblems("a", "mp4", mp4, { id: "a", src: "", duration: 6 })).toEqual(["a.mp4: lasts 8.04 s, the slide says 6 s"]);
    expect(encodeProblems("a", "mp4", { streams: [] }, { id: "a", src: "" })).toEqual(["a.mp4: no video stream"]);
  });

  it("reads whether an MP4 starts before it is downloaded", () => {
    expect(fastStart(moovFirst)).toBe(true);
    expect(fastStart(mdatFirst)).toBe(false);
    expect(fastStart(new Uint8Array([0, 0]))).toBeUndefined();
  });
});

describe("the ffmpeg adapter", () => {
  it("reads ffprobe's JSON and the stats ffmpeg prints", () => {
    const facts = parseProbe(
      JSON.stringify({
        streams: [
          { codec_type: "video", codec_name: "h264", width: 1280, height: 720, pix_fmt: "yuv420p" },
          { codec_type: "audio", codec_name: "aac" },
        ],
        format: { duration: "7.960000" },
      }),
    );
    expect(facts).toEqual({ streams: [{ kind: "video", codec: "h264", width: 1280, height: 720, pixFmt: "yuv420p" }, { kind: "audio", codec: "aac" }], duration: 7.96 });
    expect(statValues("frame:0\nlavfi.signalstats.YMAX=235\nframe:1\nlavfi.signalstats.YMAX=12\n", "YMAX")).toEqual([235, 12]);
  });

  it("runs ffprobe and ffmpeg with the crops of the six bands", async () => {
    const calls: string[][] = [];
    const port = ffmpegPort((cmd, args) => {
      calls.push([cmd, ...args]);
      return cmd === "ffprobe" ? JSON.stringify({ streams: [], format: {} }) : "lavfi.signalstats.YMAX=200\nlavfi.signalstats.YAVG=80\n";
    }, (async () => new Response(null, { status: 200, headers: { "content-type": "video/mp4" } })) as typeof fetch);
    expect(await port.head("/a.mp4")).toEqual({ status: 200, contentType: "video/mp4" });
    expect((await port.bands("/a.mp4"))[0]).toEqual({ left: 200, right: 200, centre: 200, top: 200, bottom: 200, middle: 200 });
    expect(calls.filter(([c]) => c === "ffmpeg")).toHaveLength(6);
    expect(await port.lastFrameLuma("/a.mp4")).toBe(80);
  });
});

describe("guardSlides", () => {
  const port = (over: Partial<MediaPort> = {}): MediaPort => ({
    head: async (url) => ({ status: 200, contentType: url.endsWith(".jpg") ? "image/jpeg" : url.endsWith(".webm") ? "video/webm" : "video/mp4" }),
    facts: async (url) => (url.endsWith(".webm") ? webm : mp4),
    bands: async () => [clean],
    lastFrameLuma: async () => 90,
    firstBytes: async () => moovFirst,
    ...over,
  });
  const slide = { id: "a", src: "/a.jpg", video: { webm: "/a.webm", mp4: "/a.mp4" }, duration: 8 };

  it("passes clean files and reports what it measured", async () => {
    expect(await guardSlides([slide, { id: "s", src: "/s.jpg" }], port())).toEqual({ problems: [], measured: [{ id: "a", duration: 8.04, audio: false }] });
  });

  it("refuses a missing file, a wrong type, a slow-start mp4, a pillarboxed clip and a clip without H.264", async () => {
    expect((await guardSlides([slide], port({ head: async () => ({ status: 404, contentType: "text/html" }) }))).problems[0]).toBe("a poster: /a.jpg answers HTTP 404");
    expect((await guardSlides([slide], port({ head: async () => ({ status: 200, contentType: "text/plain" }) }))).problems[0]).toBe("a poster: /a.jpg is text/plain, expected image/");
    expect((await guardSlides([slide], port({ firstBytes: async () => mdatFirst }))).problems).toEqual(["a.mp4: moov after mdat — encode with -movflags +faststart"]);
    expect((await guardSlides([slide], port({ bands: async () => [pillar] }))).problems).toEqual(["a: 1 frame(s) are a picture between black side bars (pillarbox)"]);
    expect((await guardSlides([{ ...slide, video: { webm: "/a.webm" } }], port())).problems[0]).toMatch(/no mp4/);
  });
});
