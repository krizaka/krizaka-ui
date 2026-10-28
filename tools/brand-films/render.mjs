#!/usr/bin/env node
// Films the Krizaka flock from the code: each stage (./stage.mjs — the real @krizaka/ui components and tokens) is opened
// in a headless Chromium, every CSS animation is paused and set to the exact time of each frame (deterministic, no
// dropped frame, a loop's last frame meets its first), and the frames are encoded with ffmpeg.
//
//   pnpm turbo run build --filter=@krizaka/ui           # the stages read the built package (like tools/export-brand.mjs)
//   node tools/brand-films/render.mjs --out <dir> [--only loops|film|stills] [--birds owl,duck] [--aspects 16x9]
//                                     [--music bed.wav] [--fps 30] [--ui <packages/ui>]
//
// Writes, under <dir> (the names krizaka-com's `cdn-assets upload --to brand-films/…` keeps, hashed):
//   loops/<bird>-{square,vertical}-{dark,light}.{mp4,webm,jpg}   8 s, seamless, 1080 wide, no sound
//   loops/<bird>-alpha.{webm,png}                                 transparent VP9 (720²) + its still
//   film/le-monde-de-krizaka-{16x9,9x16}.{mp4,webm,jpg}          the site's cut: no burned captions, music
//   film/le-monde-de-krizaka-{16x9,9x16}-{en,fr}.mp4              the social cuts: captions burned in
//   film/le-monde-de-krizaka-{en,fr}.vtt, film/cues.json          the captions
//   stills/…png                                                   --only stills: one frame per moment, for review
//   render-report.json                                            what was made, how long it took
// Needs ffmpeg (libx264, libvpx-vp9, libopus) on the PATH, and Playwright's Chromium (apps/storybook's playwright).
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { fixedBin } from "../../scripts/fixed-bin.mjs";
import { birdLoops, LOOP, LOOP_BIRDS } from "./choreography.mjs";
import { AMBIENT, FILM, vtt } from "./film.mjs";
import { ambientHtml, captionHtml, filmHtml, loadKit, loopBackgroundHtml, loopLayerHtml } from "./stage.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const pad = (n) => String(n).padStart(5, "0");

export function parseArgs(argv) {
  const o = { only: ["loops", "film"], birds: LOOP_BIRDS, aspects: Object.keys(FILM.aspects), fps: LOOP.fps, ui: join(REPO, "packages/ui") };
  for (let i = 0; i < argv.length; i++) {
    const [k, v] = [argv[i], argv[i + 1]];
    if (k === "--out") (o.out = resolve(v), i++);
    else if (k === "--only") (o.only = v.split(","), i++);
    else if (k === "--birds") (o.birds = v.split(","), i++);
    else if (k === "--aspects") (o.aspects = v.split(","), i++);
    else if (k === "--music") (o.music = resolve(v), i++);
    else if (k === "--fps") (o.fps = Number(v), i++);
    else if (k === "--ui") (o.ui = resolve(v), i++);
    else throw new Error(`unknown argument ${k}`);
  }
  if (!o.out) throw new Error("--out <dir> is required");
  for (const b of o.birds) if (!LOOP_BIRDS.includes(b)) throw new Error(`no loop for "${b}" (${LOOP_BIRDS.join(", ")})`);
  for (const a of o.aspects) if (!FILM.aspects[a]) throw new Error(`no aspect "${a}" (${Object.keys(FILM.aspects).join(", ")})`);
  return o;
}

/** The ffmpeg arguments of each output (tested): the same encodings for every film. */
export const ENC = {
  mp4: ["-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-tag:v", "avc1", "-movflags", "+faststart"],
  webm: ["-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p"],
  alpha: ["-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0"],
  aac: ["-c:a", "aac", "-b:a", "160k"],
  opus: ["-c:a", "libopus", "-b:a", "128k"],
};

const FFMPEG = () => fixedBin("ffmpeg"); // looked up when a render starts: importing the module needs no ffmpeg

function ffmpeg(args, { input } = {}) {
  return new Promise((ok, fail) => {
    const p = spawn(FFMPEG(), ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: [input ? "pipe" : "ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", fail);
    p.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg failed (${code}): ${err.slice(-800)}`))));
    if (input) input(p.stdin);
  });
}

/** Opens a stage, pauses every animation; `at(seconds)` sets them all to that time. */
async function stage(browser, work, name, html, [width, height]) {
  const file = join(work, `${name}.html`);
  writeFileSync(file, html);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const a of document.getAnimations()) a.pause();
  });
  const at = (s) => page.evaluate((ms) => {
    for (const a of document.getAnimations()) a.currentTime = ms;
  }, s * 1000);
  return { page, at, close: () => page.close() };
}

/** Frames of a stage to PNG files (`alpha`: the page's background left transparent). */
async function framesToDir(st, dir, { seconds, fps, alpha }) {
  mkdirSync(dir, { recursive: true });
  const n = Math.round(seconds * fps);
  for (let f = 0; f < n; f++) {
    await st.at(f / fps);
    await st.page.screenshot({ path: join(dir, `${pad(f)}.png`), omitBackground: alpha });
  }
  // Seamless: the frame after the last is the first one again (to the rasteriser's noise: PSNR ≥ SEAMLESS_DB).
  const end = join(dir, "end.png");
  await st.at(seconds);
  await st.page.screenshot({ path: end, omitBackground: alpha });
  const db = await psnr(join(dir, `${pad(0)}.png`), end);
  rmSync(end);
  return { frames: n, seamless: db >= SEAMLESS_DB, db };
}

/** Two frames this close are the same picture to the eye (the GPU rasteriser is not bit-exact from one pass to the next). */
export const SEAMLESS_DB = 45;

/** The PSNR of two images, in dB (Infinity when identical). */
function psnr(a, b) {
  return new Promise((ok, fail) => {
    const p = spawn(FFMPEG(), ["-hide_banner", "-i", a, "-i", b, "-lavfi", "psnr", "-f", "null", "-"], { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", () => {
      const m = /average:(inf|[\d.]+)/.exec(err);
      return m ? ok(m[1] === "inf" ? Infinity : Number(m[1])) : fail(new Error(`psnr: ${err.slice(-300)}`));
    });
  });
}

async function renderLoops(browser, kit, o, work, report) {
  const out = join(o.out, "loops");
  mkdirSync(out, { recursive: true });
  const loops = birdLoops();
  const size = 1080;
  for (const bird of o.birds) {
    const t0 = Date.now();
    const entry = { bird, files: [] };
    for (const theme of ["dark", "light", "alpha"]) {
      const st = await stage(browser, work, `${bird}-${theme}`, loopLayerHtml({ kit, bird, theme, size }), [size, size]);
      const dir = join(work, `${bird}-${theme}`);
      const { frames, seamless, db } = await framesToDir(st, dir, { seconds: LOOP.seconds, fps: o.fps, alpha: true });
      await st.close();
      if (!seamless) throw new Error(`${bird} (${theme}): the last frame does not meet the first — a track is not closed`);
      entry.frames = frames;
      entry.seamlessDb = Math.min(entry.seamlessDb ?? Infinity, db);
      const seq = ["-framerate", String(o.fps), "-i", join(dir, "%05d.png")];
      if (theme === "alpha") {
        const base = join(out, `${bird}-alpha`);
        await ffmpeg([...seq, "-vf", "scale=720:720:flags=lanczos", ...ENC.alpha, `${base}.webm`]);
        await ffmpeg(["-i", join(dir, `${pad(Math.round(loops[bird].poster * o.fps))}.png`), "-vf", "scale=720:720:flags=lanczos", `${base}.png`]);
        entry.files.push(`${base}.webm`, `${base}.png`);
        continue;
      }
      for (const [shape, dims] of [["square", [size, size]], ["vertical", [size, Math.round((size * 16) / 9)]]]) {
        const bg = await stage(browser, work, `${bird}-${theme}-${shape}-bg`, loopBackgroundHtml({ kit, bird, theme, width: dims[0], height: dims[1] }), dims);
        const bgPng = join(work, `${bird}-${theme}-${shape}-bg.png`);
        await bg.page.screenshot({ path: bgPng });
        await bg.close();
        const base = join(out, `${bird}-${shape}-${theme}`);
        const graph = ["-filter_complex", `[0][1]overlay=0:${(dims[1] - size) / 2}:shortest=1`, "-frames:v", String(frames)];
        const inputs = ["-loop", "1", "-framerate", String(o.fps), "-i", bgPng, ...seq];
        await ffmpeg([...inputs, ...graph, ...ENC.mp4, `${base}.mp4`]);
        await ffmpeg([...inputs, ...graph, ...ENC.webm, `${base}.webm`]);
        await ffmpeg(["-ss", String(loops[bird].poster), "-i", `${base}.mp4`, "-frames:v", "1", "-q:v", "3", `${base}.jpg`]);
        entry.files.push(`${base}.mp4`, `${base}.webm`, `${base}.jpg`);
      }
      rmSync(dir, { recursive: true });
    }
    entry.seconds = Math.round((Date.now() - t0) / 1000);
    report.loops.push(entry);
    console.log(`loop ${bird}: ${entry.files.length} files in ${entry.seconds} s`);
  }
}

async function renderFilm(browser, kit, o, work, report) {
  const out = join(o.out, "film");
  mkdirSync(out, { recursive: true });
  const name = FILM.name;
  for (const lang of ["en", "fr"]) writeFileSync(join(out, `${name}-${lang}.vtt`), vtt(lang));
  writeFileSync(join(out, "cues.json"), `${JSON.stringify({ seconds: FILM.seconds, cues: FILM.cues }, null, 2)}\n`);
  const music = o.music ? ["-i", o.music] : [];
  const fade = `afade=t=in:st=0:d=${FILM.music.fadeIn},afade=t=out:st=${FILM.seconds - FILM.music.fadeOut}:d=${FILM.music.fadeOut}`;
  for (const aspect of o.aspects) {
    const t0 = Date.now();
    const dims = FILM.aspects[aspect];
    const st = await stage(browser, work, `film-${aspect}`, filmHtml({ kit, aspect }), dims);
    const master = join(work, `film-${aspect}-master.mp4`);
    const n = Math.round(FILM.seconds * o.fps);
    await ffmpeg(["-f", "image2pipe", "-framerate", String(o.fps), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-pix_fmt", "yuv420p", master], {
      input: async (stdin) => {
        for (let f = 0; f < n; f++) {
          await st.at(f / o.fps);
          const jpg = await st.page.screenshot({ type: "jpeg", quality: 96 });
          if (!stdin.write(jpg)) await new Promise((r) => stdin.once("drain", r));
        }
        stdin.end();
      },
    });
    await st.close();
    const base = join(out, `${name}-${aspect}`);
    const audio = (codec) => (o.music ? ["-map", "0:v", "-map", "1:a", "-af", fade, ...codec, "-t", String(FILM.seconds)] : []);
    await ffmpeg(["-i", master, ...music, ...ENC.mp4, ...audio(ENC.aac), `${base}.mp4`]);
    await ffmpeg(["-i", master, ...music, ...ENC.webm, ...audio(ENC.opus), `${base}.webm`]);
    await ffmpeg(["-ss", String(FILM.poster), "-i", master, "-frames:v", "1", "-q:v", "2", `${base}.jpg`]);
    const files = [`${base}.mp4`, `${base}.webm`, `${base}.jpg`];
    // The social cuts: each caption a transparent frame, faded in and out over the master.
    for (const lang of ["en", "fr"]) {
      const caps = [];
      for (const c of FILM.cues) {
        const cs = await stage(browser, work, `cap-${aspect}-${lang}-${c.id}`, captionHtml({ kit, aspect, text: c[lang] }), dims);
        const png = join(work, `cap-${aspect}-${lang}-${c.id}.png`);
        await cs.page.screenshot({ path: png, omitBackground: true });
        await cs.close();
        caps.push({ ...c, png });
      }
      const inputs = caps.flatMap((c) => ["-loop", "1", "-framerate", String(o.fps), "-t", String(FILM.seconds), "-i", c.png]);
      const first = o.music ? 2 : 1;
      const chain = caps
        .map((c, k) => {
          const d = 0.3;
          const prev = k === 0 ? "[0:v]" : `[v${k}]`;
          return `[${first + k}:v]format=rgba,fade=t=in:st=${c.start}:d=${d}:alpha=1,fade=t=out:st=${+(c.end - d).toFixed(3)}:d=${d}:alpha=1[c${k}];${prev}[c${k}]overlay=0:0:eof_action=pass[v${k + 1}]`;
        })
        .join(";");
      const target = `${base}-${lang}.mp4`;
      await ffmpeg(["-i", master, ...music, ...inputs, "-filter_complex", chain, "-map", `[v${caps.length}]`, ...(o.music ? ["-map", "1:a", "-af", fade, ...ENC.aac] : []), ...ENC.mp4, "-t", String(FILM.seconds), target]);
      files.push(target);
    }
    report.film.push({ aspect, frames: n, seconds: Math.round((Date.now() - t0) / 1000), files });
    console.log(`film ${aspect}: ${files.length} files in ${Math.round((Date.now() - t0) / 1000)} s`);
  }
}

/** The light encodings of the home's backdrop (a target under 1.5 MB per file). */
export const AMBIENT_ENC = {
  mp4: ["-c:v", "libx264", "-preset", "veryslow", "-crf", "27", "-pix_fmt", "yuv420p", "-tag:v", "avc1", "-movflags", "+faststart", "-an"],
  webm: ["-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "1", "-pix_fmt", "yuv420p", "-an"],
};

async function renderAmbient(browser, kit, o, work, report, { birds = true } = {}) {
  const name = birds ? AMBIENT.name : AMBIENT.valleyName;
  const out = join(o.out, "ambient");
  mkdirSync(out, { recursive: true });
  for (const [aspect, [w, h]] of Object.entries(AMBIENT.aspects)) {
    for (const theme of ["dark", "light"]) {
      const t0 = Date.now();
      const st = await stage(browser, work, `ambient-${aspect}-${theme}`, ambientHtml({ kit, aspect, theme, birds }), FILM.aspects[aspect]);
      const dir = join(work, `ambient-${aspect}-${theme}`);
      const { frames, seamless, db } = await framesToDir(st, dir, { seconds: AMBIENT.seconds, fps: AMBIENT.fps, alpha: false });
      await st.close();
      if (!seamless) throw new Error(`ambient ${aspect} ${theme}: the last frame does not meet the first`);
      const base = join(out, `${name}-${aspect}-${theme}`);
      const seq = ["-framerate", String(AMBIENT.fps), "-i", join(dir, "%05d.png"), "-vf", `scale=${w}:${h}:flags=lanczos`];
      await ffmpeg([...seq, ...AMBIENT_ENC.mp4, `${base}.mp4`]);
      await ffmpeg([...seq, ...AMBIENT_ENC.webm, `${base}.webm`]);
      await ffmpeg(["-i", join(dir, `${pad(Math.round(AMBIENT.poster * AMBIENT.fps))}.png`), "-vf", `scale=${w}:${h}:flags=lanczos`, "-q:v", "4", `${base}.jpg`]);
      rmSync(dir, { recursive: true });
      report.ambient.push({ aspect, theme, frames, seamlessDb: db, seconds: Math.round((Date.now() - t0) / 1000), files: [`${base}.mp4`, `${base}.webm`, `${base}.jpg`] });
      console.log(`ambient ${aspect} ${theme}: ${Math.round((Date.now() - t0) / 1000)} s`);
    }
  }
}

/** One frame per moment, as PNG — to look at the choreography before a full render. */
async function renderStills(browser, kit, o, work) {
  const out = join(o.out, "stills");
  mkdirSync(out, { recursive: true });
  const loops = birdLoops();
  for (const bird of o.birds) {
    for (const theme of ["dark", "light"]) {
      const st = await stage(browser, work, `s-${bird}-${theme}`, loopLayerHtml({ kit, bird, theme, size: 540 }), [540, 540]);
      for (const t of [0, 1.2, 2.4, 3.2, loops[bird].poster]) {
        await st.at(t);
        await st.page.evaluate((dark) => (document.body.style.background = dark ? "#0d0d10" : "#ffffff"), theme === "dark");
        await st.page.screenshot({ path: join(out, `${bird}-${theme}-${t}.png`) });
      }
      await st.close();
    }
  }
  if (o.only.includes("ambient-stills")) {
    for (const aspect of Object.keys(AMBIENT.aspects))
      for (const theme of ["dark", "light"]) {
        const st = await stage(browser, work, `s-amb-${aspect}-${theme}`, ambientHtml({ kit, aspect, theme }), FILM.aspects[aspect]);
        for (const t of [0, 1.2, 5.6, 9]) {
          await st.at(t);
          await st.page.screenshot({ path: join(out, `ambient-${aspect}-${theme}-${t}.jpg`), type: "jpeg", quality: 80 });
        }
        await st.close();
      }
    return;
  }
  for (const aspect of o.aspects) {
    const st = await stage(browser, work, `s-film-${aspect}`, filmHtml({ kit, aspect }), FILM.aspects[aspect]);
    for (const t of [1.5, 4.5, 8, 14, 20, 26, 32, FILM.poster, 38.5, 43.5]) {
      await st.at(t);
      await st.page.screenshot({ path: join(out, `film-${aspect}-${t}.jpg`), type: "jpeg", quality: 80 });
    }
    await st.close();
  }
}

export async function main(argv) {
  const o = parseArgs(argv);
  const kit = await loadKit(o.ui);
  const { chromium } = createRequire(resolve(o.ui, "../../apps/storybook/package.json"))("playwright");
  const browser = await chromium.launch();
  const work = mkdtempSync(join(tmpdir(), "brand-films-"));
  const report = { ui: kit.version, fps: o.fps, music: o.music ? FILM.music : null, started: new Date().toISOString(), loops: [], film: [], ambient: [] };
  const t0 = Date.now();
  try {
    if (o.only.some((x) => x.includes("stills"))) await renderStills(browser, kit, o, work);
    if (o.only.includes("loops")) await renderLoops(browser, kit, o, work, report);
    if (o.only.includes("film")) await renderFilm(browser, kit, o, work, report);
    if (o.only.includes("ambient")) await renderAmbient(browser, kit, o, work, report);
    if (o.only.includes("ambient-valley")) await renderAmbient(browser, kit, o, work, report, { birds: false });
  } finally {
    await browser.close();
    rmSync(work, { recursive: true });
  }
  report.totalSeconds = Math.round((Date.now() - t0) / 1000);
  const sizes = {};
  for (const e of [...report.loops, ...report.film, ...report.ambient]) for (const f of e.files) sizes[f.slice(o.out.length + 1)] = statSync(f).size;
  report.bytes = sizes;
  if (!o.only.every((x) => x.includes("stills"))) writeFileSync(join(o.out, "render-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`done in ${report.totalSeconds} s`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
