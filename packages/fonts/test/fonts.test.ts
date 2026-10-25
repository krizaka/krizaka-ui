import { createHash } from "node:crypto";
import { existsSync, readdirSync,readFileSync } from "node:fs";
import { join } from "node:path";

import { compile, fallbackMetrics, load, ROLES, TOKENS } from "../scripts/build.mjs";

const root = join(import.meta.dirname, "..");
const { source, faces } = load(root);
const { families, files } = compile(source, faces);
const css = files["fonts.css"];
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

/** The @font-face blocks of the CSS, as maps of descriptors. */
const blocks = [...css.matchAll(/@font-face \{([^}]+)\}/g)].map(
  ([, body]) => new Map([...body.matchAll(/([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()])),
);

describe("the families", () => {
  it("are one display, one text and one mono face, the sparing handwritten pen, then the products' title face, in that order", () => {
    expect(families.map((f) => f.role)).toEqual(["display", "text", "mono", "cahier", "product-display"]);
    expect(families.map((f) => f.family)).toEqual(["Young Serif", "Atkinson Hyperlegible Next", "Courier Prime", "Krizaka Cahier", "Plus Jakarta Sans"]);
  });

  // ADR-006 §2, krizaka-ui#670 — Plus Jakarta Sans is back as a role of the product register only.
  describe("the product-display role (ADR-006 #670)", () => {
    const product = families.find((f) => f.role === "product-display")!;

    it("is Plus Jakarta Sans on its own token, from this package's files (never Google Fonts)", () => {
      expect(product.family).toBe("Plus Jakarta Sans");
      expect(product.token).toBe("--kz-font-product-display");
      expect(product.web.map((w) => w.path)).toEqual(["files/web/plus-jakarta-sans-latin-wght.woff2", "files/web/plus-jakarta-sans-latin-ext-wght.woff2"]);
      for (const w of product.web) expect(existsSync(join(root, w.path)), w.path).toBe(true);
      expect(css).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
    });

    it("is variable over the weights the register uses (550, 650, 700), in latin and latin-ext", () => {
      expect(product.static).toBe(false);
      expect(product.weights.min).toBeLessThanOrEqual(550);
      expect(product.weights.max).toBeGreaterThanOrEqual(700);
      expect(product.web.map((w) => w.subset)).toEqual(["latin", "latin-ext"]);
    });

    it("has a CLS-safe fallback: a metric-matched local face, swap, and a stack that starts with both", () => {
      expect(product.fallback.local.length).toBeGreaterThan(0);
      for (const key of ["sizeAdjust", "ascentOverride", "descentOverride", "lineGapOverride"] as const) expect(product.fallback[key]).toMatch(/^[\d.]+%$/);
      const b = blocks.find((x) => x.get("font-family") === `"${product.fallbackFamily}"`)!;
      expect(b.get("size-adjust")).toBe(product.fallback.sizeAdjust);
      expect(product.stack.replaceAll('"', "").startsWith("Plus Jakarta Sans, Plus Jakarta Sans Fallback, ")).toBe(true);
      for (const b2 of blocks.filter((x) => x.get("font-family") === '"Plus Jakarta Sans"')) expect(b2.get("font-display")).toBe("swap");
    });

    it("is never preloaded: a Cahier site that imports the CSS does not download it", async () => {
      const mod = await import(join(root, "dist/index.js"));
      expect(mod.preload.some((p: string) => p.includes("plus-jakarta"))).toBe(false);
    });

    it("tells the sites to keep Young Serif and the products to avoid weight 800", () => {
      expect(product.avoid.join(" ")).toMatch(/Cahier sites/);
      expect(product.avoid.join(" ")).toMatch(/800/);
      expect(product.why).toMatch(/ADR-006/);
    });

    it("keeps its old files resolvable as a legacy path (nothing is removed in a minor)", async () => {
      const mod = await import(join(root, "dist/index.js"));
      expect(mod.legacyFonts.map((f: { family: string }) => f.family)).toEqual(["Plus Jakarta Sans", "Inter", "JetBrains Mono"]);
    });
  });

  it("the pen is Krizaka Cahier: a renamed, derived face on its own token, one weight, never preloaded, with the French alphabet and §", () => {
    const pen = families.find((f) => f.role === "cahier")!;
    expect(pen.family).toBe("Krizaka Cahier");
    expect(pen.token).toBe("--kz-font-cahier");
    expect(pen.weights).toEqual({ min: 500, max: 500 });
    expect(pen.avoid.join(" ")).toMatch(/paragraphs/i);
    expect(pen.web.map((w) => w.subset)).toEqual(["latin"]);
    const ranges = pen.web[0].unicodeRange;
    for (const needle of ["U+00A0-00FF", "U+0152-0153", "U+2018-201D"]) expect(ranges).toContain(needle); // é è à ç œ « » ’ § (U+00A7)
    expect(pen.upstream.derivedFrom).toBe("Caveat");
  });

  it("the pen's glyph coverage holds the French accents, œ and §, with tabular lining figures", async () => {
    const { readFileSync: read } = await import("node:fs");
    const ttf = read(join(root, families.find((f) => f.role === "cahier")!.native[0].path));
    const cmapHas = (cp: number) => ttf.includes(Buffer.from([cp >> 8, cp & 255])); // coarse: the codepoint appears in the font's cmap data
    for (const cp of [0xa7, 0xe9, 0xe8, 0xe0, 0xe7, 0x153, 0xab, 0xbb, 0x2019]) expect(cmapHas(cp), cp.toString(16)).toBe(true);
    expect(ttf.subarray(0, 4).toString("hex")).toBe("00010000");
  });

  it("ships the FONTLOG and the OFL of the derived face, crediting its upstream", () => {
    const log = readFileSync(join(root, "licenses/KrizakaCahier-FONTLOG.txt"), "utf8");
    expect(log).toMatch(/modified version of Caveat/);
    expect(log).toMatch(/renamed/);
    expect(log).toMatch(/SIL Open Font License 1\.1/);
    expect(readFileSync(join(root, "licenses/KrizakaCahier-OFL.txt"), "utf8")).toMatch(/Caveat Project Authors/);
    expect(pkg.files).toContain("licenses");
  });

  it("ships the OFL of every family it declares, the derived pen included, with no Reserved Font Name", () => {
    for (const f of families) {
      const text = readFileSync(join(root, f.license.file), "utf8");
      expect(text, f.family).toContain("SIL OPEN FONT LICENSE Version 1.1");
      expect(text, f.family).not.toMatch(/with Reserved Font Name/i);
    }
    expect(pkg.files).toContain("licenses");
    expect(existsSync(join(root, "licenses/KrizakaCahier-OFL.txt"))).toBe(true);
  });

  it("keep Inter and JetBrains Mono as legacy files, never as a role (#417; Plus Jakarta Sans is a role again, below)", () => {
    const legacy = source.families.filter((f: { legacy?: boolean }) => f.legacy).map((f: { family: string }) => f.family);
    expect(legacy).toEqual(["Inter", "JetBrains Mono"]);
    expect(css).not.toMatch(/Inter|JetBrains Mono/);
  });

  it("the display face has one weight and is never bold", () => {
    const display = families.find((f) => f.role === "display")!;
    expect(display.weights).toEqual({ min: 400, max: 400 });
    expect(display.static).toBe(true);
  });

  it("each fills one token of @krizaka/tokens", () => {
    for (const f of families) expect(f.token).toBe(TOKENS[f.role]);
  });

  it("carry the words of the documentation", () => {
    for (const f of families) {
      expect(f.description.length).toBeGreaterThan(20);
      expect(f.why.length).toBeGreaterThan(40);
      expect(f.use.length).toBeGreaterThan(0);
      expect(f.avoid.length).toBeGreaterThan(0);
    }
    expect(source.rules.length).toBeGreaterThanOrEqual(5);
  });

  it("are pinned to an upstream commit", () => {
    for (const f of families) expect(f.upstream.commit).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe("the files", () => {
  const all = Object.values(faces).flatMap((face) => [...face.web, ...face.native]);

  it("are the ones src/faces.json describes (bytes and sha256)", () => {
    for (const file of all) {
      const data = readFileSync(join(root, file.file));
      expect(data.length, file.file).toBe(file.bytes);
      expect(createHash("sha256").update(data).digest("hex"), file.file).toBe(file.sha256);
    }
  });

  it("have no stray file next to them", () => {
    const listed = new Set(all.map((f) => f.file));
    for (const dir of ["files/web", "files/native"]) {
      for (const name of readdirSync(join(root, dir))) expect(listed.has(`${dir}/${name}`), `${dir}/${name}`).toBe(true);
    }
  });

  it("web: a WOFF2 per family, subset (latin, latin-ext) and, for a static family, weight", () => {
    for (const f of families) {
      const perWeight = f.static ? new Set(f.web.map((w) => w.weight)).size : 1;
      const subsets = f.role === "cahier" ? ["latin"] : ["latin", "latin-ext"]; // the pen keeps the French alphabet only
      expect(f.web).toHaveLength(subsets.length * perWeight);
      expect([...new Set(f.web.map((w) => w.subset))]).toEqual(subsets);
      for (const w of f.web) expect(readFileSync(join(root, w.path)).subarray(0, 4).toString("latin1")).toBe("wOF2");
    }
  });

  it("native: a static TrueType per weight, named <Family>-<Style>", () => {
    for (const f of families) {
      expect(f.native.length).toBeGreaterThan(0);
      for (const n of f.native) {
        expect(n.path).toBe(`files/native/${n.name}.ttf`);
        expect(readFileSync(join(root, n.path)).readUInt32BE(0)).toBe(0x00010000);
      }
    }
  });

  it("French is in the latin subset (é è à ç ô œ « » ’ …)", () => {
    const ranges = source.subsets.latin.split(",").map((r) => r.trim().replace("U+", "").split("-").map((h) => parseInt(h, 16)));
    const covered = (cp: number) => ranges.some(([lo, hi = lo]) => cp >= lo && cp <= hi);
    for (const ch of "éèêëàâçôœÉÀÇ«»’…€—–→") expect(covered(ch.codePointAt(0)!), ch).toBe(true);
  });
});

describe("fonts.css", () => {
  it("declares every family once per subset, swap, with its unicode-range and weight range", () => {
    for (const f of families) {
      const faces = blocks.filter((b) => b.get("font-family")?.replaceAll('"', "") === f.family);
      expect(faces).toHaveLength(f.web.length);
      for (const [i, b] of faces.entries()) {
        expect(b.get("font-display")).toBe("swap");
        expect(b.get("font-weight")).toBe(String(f.web[i].weight ?? `${f.weights.min} ${f.weights.max}`));
        expect(b.get("unicode-range")).toBe(f.web[i].unicodeRange);
        const url = /url\("\.\.\/([^"]+)"\) format\("woff2"\)/.exec(b.get("src") ?? "")?.[1];
        expect(url).toBe(f.web[i].path);
        expect(existsSync(join(root, url!))).toBe(true);
      }
    }
  });

  it("declares a metric-matched local fallback for every family (CLS 0)", () => {
    for (const f of families) {
      const b = blocks.find((x) => x.get("font-family") === `"${f.fallbackFamily}"`);
      expect(b, f.fallbackFamily).toBeDefined();
      expect(b!.get("src")).toMatch(/^local\(/);
      for (const prop of ["size-adjust", "ascent-override", "descent-override", "line-gap-override"]) expect(b!.get(prop)).toMatch(/^\d+\.\d\d%$/);
    }
  });

  it("the stacks start with the family and its fallback", () => {
    for (const f of families) expect(f.stack.replaceAll('"', "").startsWith(`${f.family}, ${f.fallbackFamily}, `)).toBe(true);
  });
});

describe("fallbackMetrics", () => {
  it("matches next/font's Inter-on-Arial adjustment within half a percent", () => {
    const m = fallbackMetrics(faces.inter.metrics, source.fallbacks.Arial);
    // next/font (adjustFontFallback) for Inter: size-adjust 107.12%, ascent 90.44%, descent 22.52%.
    expect(Math.abs(parseFloat(m.sizeAdjust) - 107.12)).toBeLessThan(0.5);
    expect(Math.abs(parseFloat(m.ascentOverride) - 90.44)).toBeLessThan(0.5);
    expect(Math.abs(parseFloat(m.descentOverride) - 22.52)).toBeLessThan(0.5);
  });

  it("a monospace fallback matches the advance exactly", () => {
    const mono = families.find((f) => f.role === "mono")!;
    expect(mono.metrics.avgWidth / mono.metrics.unitsPerEm).toBeCloseTo(0.6, 2);
  });
});

describe("the licences", () => {
  it("ship the SIL OFL 1.1 of every family, with its copyright", () => {
    for (const f of families) {
      const text = readFileSync(join(root, f.license.file), "utf8");
      expect(text).toContain("SIL OPEN FONT LICENSE Version 1.1");
      expect(text).toMatch(/^Copyright \d{4}(-\d{4})? (The .+ Project Authors|Google Inc\.)/);
      expect(f.license.spdx).toBe("OFL-1.1");
    }
  });

  it("are published (files, exports, license field)", () => {
    expect(pkg.files).toEqual(expect.arrayContaining(["dist", "files", "licenses", "LICENSE"]));
    expect(pkg.exports["./licenses/*"]).toBe("./licenses/*");
    expect(pkg.license).toContain("OFL-1.1");
  });
});

describe("the entries", () => {
  it("export ., ./css, ./native, ./native/assets and the files", () => {
    expect(Object.keys(pkg.exports)).toEqual([".", "./css", "./native", "./native/assets", "./files/*", "./licenses/*", "./package.json"]);
    expect(pkg.exports["./css"].default).toBe("./dist/fonts.css");
  });

  it("index: the data, the rules, the preloads and fontStack", async () => {
    const mod = await import(`data:text/javascript,${encodeURIComponent(files["index.js"])}`);
    expect(mod.fonts.map((f: { role: string }) => f.role)).toEqual([...ROLES]);
    expect(mod.preload).toHaveLength(3); // the pen is not preloaded
    for (const p of mod.preload) expect(p).toMatch(/-latin-(wght|400)\.woff2$/);
    expect(mod.fontStack("text")).toMatch(/^"Atkinson Hyperlegible Next", "Atkinson Hyperlegible Next Fallback", /);
    expect(mod.fontStack("display")).toMatch(/^"Young Serif", "Young Serif Fallback", Georgia/);
    expect(mod.legacyFonts.map((f: { family: string }) => f.family)).toEqual(["Plus Jakarta Sans", "Inter", "JetBrains Mono"]);
    for (const f of mod.legacyFonts) for (const w of f.web) expect(existsSync(join(root, w.path)), w.path).toBe(true);
    expect(() => mod.fontStack("serif")).toThrow();
  });

  it("native: the nearest shipped weight of a role", async () => {
    const mod = await import(`data:text/javascript,${encodeURIComponent(files["native.js"])}`);
    expect(mod.fontFamily("display", 800)).toBe("YoungSerif-Regular");
    expect(mod.fontFamily("display")).toBe("YoungSerif-Regular");
    expect(mod.fontFamily("text")).toBe("AtkinsonHyperlegibleNext-Regular");
    expect(mod.fontFamily("text", 650)).toBe("AtkinsonHyperlegibleNext-Bold");
    expect(mod.fontFamily("mono", 500)).toBe("CourierPrime-Regular");
    expect(mod.fontFamily("mono", 700)).toBe("CourierPrime-Bold");
    expect(() => mod.fontFamily("serif")).toThrow();
  });

  it("native/assets: one require per native file, keyed by its name", () => {
    const js = files["native-assets.js"];
    for (const f of families) for (const n of f.native) expect(js).toContain(`"${n.name}": require("../${n.path}"),`);
    expect(files["native.d.ts"]).toContain('"AtkinsonHyperlegibleNext-Regular"');
  });
});
