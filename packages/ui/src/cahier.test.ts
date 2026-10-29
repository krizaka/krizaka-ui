// krizaka-ui#417, ADR-004 — the Cahier: the template tells stay retired in the primitives' own classes. This test reads
// the web sources and refuses an uppercase tracked label, a frosted (backdrop-blur) chrome, and a pill on the chrome that
// reads as « every AI template » (the bar, its items, badges, chips, tabs, the language switch, toasts).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = import.meta.dirname;
/** Over a media (a video, a photo), a caps label or a blur reads the picture, not the template: allowed there only. */
const MEDIA = ["vertical-video", "video-player", "avatar"];

/** A person's own choice, not a class of the primitives: the text style's case (« upper ») is drawn as the CSS value they picked. */
const CHOSEN = ["text-style/text-style.ts"];

function webSources(dir = SRC): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "native" || name === "test" ? [] : webSources(path);
    return /\.(tsx|ts)$/.test(name) && !/\.(test|stories)\.tsx?$|meta\.ts$|recipes\/native\.ts$/.test(path) ? [path] : [];
  });
}
/** The code without its comments (a comment may name what it refuses). */
const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/\s\/\/ .*$/gm, "");
const sources = webSources().map((f) => [f.slice(SRC.length + 1), code(readFileSync(f, "utf8"))] as const);

describe("Cahier (ADR-004): no template tell in the primitives' classes", () => {
  it("no uppercase, tracked label outside a media", () => {
    for (const [file, src] of sources) {
      if (MEDIA.some((m) => file.startsWith(m))) continue;
      if (!CHOSEN.includes(file)) expect(src, file).not.toMatch(/["'\s]uppercase["'\s]/);
      expect(src, file).not.toMatch(/tracking-(wider|widest)/);
    }
  });

  it("no frosted chrome: backdrop blur only over a media", () => {
    for (const [file, src] of sources) {
      if (MEDIA.some((m) => file.startsWith(m))) continue;
      // A scrim (a badge or a control laid over a picture) may blur what is under it.
      for (const line of src.split("\n").filter((l) => l.includes("backdrop-blur"))) expect(line, file).toMatch(/scrim/);
    }
  });

  it("the bar, its items and buttons, badges, chips, tabs, the language switch and toasts are square paper, never pills", () => {
    for (const file of ["nav-bar/nav-bar.tsx", "badge/recipe.ts", "chip/recipe.ts", "chip-link/chip-link.tsx", "tabs/tabs.tsx", "language-switch/language-switch.tsx", "toast/toast.tsx", "kanban/kanban.tsx", "map/location-picker.tsx", "slider/slider.tsx"]) {
      const src = readFileSync(join(SRC, file), "utf8");
      // A dot (h-N w-N, size-N) may stay round; a control or a label may not.
      for (const cls of src.match(/"[^"\n]*rounded-full[^"\n]*"/g) ?? []) {
        expect(cls, file).toMatch(/\b(?:h-([\d.]+) w-\1|size-[\d.]+|h-1\.5 w-1\.5)\b/);
      }
    }
  });

  it("the shipped stylesheets: no card corner of 10 px or more, no blurred shadow, no radial glow", () => {
    for (const sheet of ["blocks.css", "motion.css"]) {
      const css = readFileSync(join(SRC, sheet), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      for (const m of css.matchAll(/border-radius:\s*(\d+)px/g)) expect(Number(m[1]) < 10 || Number(m[1]) >= 999, `${sheet}: border-radius ${m[1]}px`).toBe(true);
      for (const m of css.matchAll(/box-shadow:([^;]+);/g)) {
        for (const layer of m[1].split(/,(?![^(]*\))/)) {
          const lengths = layer.trim().match(/-?[\d.]+px|\b0\b/g) ?? [];
          if (lengths.length >= 3) expect(lengths[2], `${sheet}: ${layer.trim()}`).toMatch(/^0(px)?$/);
        }
      }
      expect(css, sheet).not.toMatch(/radial-gradient\((?!circle at 1px 1px)/);
    }
  });

  it("every figure is a lining figure: the stylesheets ask for --kz-figures, native asks for lining-nums", () => {
    for (const sheet of ["blocks.css", "motion.css", "story.css"]) {
      const css = readFileSync(join(SRC, sheet), "utf8");
      for (const m of css.matchAll(/font-variant-numeric:\s*([^;]+);/g)) expect(m[1], sheet).toContain("var(--kz-figures");
    }
    for (const sel of [".kz-count", ".kz-tpl-band dt", ".kz-tpl-price", ".kz-decision-n"]) {
      const css = readFileSync(join(SRC, sel === ".kz-count" ? "motion.css" : "blocks.css"), "utf8");
      const at = css.indexOf(sel + " {");
      expect(at, sel).toBeGreaterThan(-1);
      expect(css.slice(at, css.indexOf("}", at)), sel).toContain("var(--kz-figures");
    }
    const native = join(SRC, "native");
    for (const name of readdirSync(native).filter((n) => n.endsWith(".tsx"))) {
      const src = readFileSync(join(native, name), "utf8");
      for (const m of src.matchAll(/fontVariant:\s*\[([^\]]*)\]/g)) if (m[1].includes("tabular-nums")) expect(m[1], name).toContain("lining-nums");
    }
  });
});
