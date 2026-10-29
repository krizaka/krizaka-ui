// The pure core, shared by web and React Native: formats, scales, shapes, summaries — and the palettes, checked for
// colour-vision deficiency the way the data-viz method asks (computed, never eyeballed).
import { correlation } from "../scatter/scatter-chart";
import { summarize, tabulate } from "./data";
import { describeSeries } from "./describe";
import { categoryFormatter, shareFormatter, valueFormatter } from "./format";
import { DEFAULT_LABELS, mergeLabels } from "./labels";
import { contrast, HUES, ORDERS, palette, parseColor, sequential } from "./palette";
import { niceDomain, thinLabels } from "./scale";
import { arcPath, barPath, linePath, segments } from "./shape";

const nb = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("formats (@krizaka/intl)", () => {
  it("writes money from integer minor units, exact in tooltips, round on axes", () => {
    const money = { style: "money", currency: "EUR" } as const;
    expect(valueFormatter(money, "en-US")(342_050)).toBe("€3,420.50");
    expect(valueFormatter(money, "en-US", "—", true)(250_000)).toBe("€2,500");
    expect(valueFormatter(money, "en-US", "—", true)(4_200_000)).toBe("€42K");
    expect(nb(valueFormatter(money, "fr-FR")(342_050))).toBe("3 420,50 €");
    expect(valueFormatter(money, "en-US")(null)).toBe("—");
  });

  it("writes numbers, compacts, percents and units in the locale", () => {
    expect(valueFormatter("compact", "en-US")(48_200)).toBe("48.2K");
    expect(nb(valueFormatter("compact", "fr-FR")(48_200))).toBe("48,2 k");
    expect(valueFormatter("percent", "en-US")(0.4237)).toBe("42.4%");
    expect(valueFormatter({ style: "unit", unit: "gigabyte" }, "en-US")(20.2)).toBe("20.2 GB");
    expect(valueFormatter("number", "en-US", "—", true)(52_800)).toBe("52.8K");
    expect(shareFormatter("en-US")(0.056)).toBe("5.6%");
  });

  it("writes ISO dates by their precision, in UTC, in the locale", () => {
    const en = categoryFormatter(undefined, "en-US");
    expect(en("2026-04")).toBe("Apr 2026");
    expect(en("2026-04-12")).toBe("Apr 12, 2026");
    expect(categoryFormatter("day", "fr-FR")("2026-04-12")).toBe("12 avr.");
    expect(categoryFormatter("time", "en-GB")("2026-10-11T14:30Z")).toBe("14:30");
    expect(en("Pro plan")).toBe("Pro plan");
  });
});

describe("scales and shapes", () => {
  it("rounds the domain to ticks a reader counts", () => {
    expect(niceDomain(0, 4870, 5)).toEqual({ domain: [0, 5000], ticks: [0, 1000, 2000, 3000, 4000, 5000] });
    expect(niceDomain(0.1, 0.3, 2).ticks).toEqual([0.1, 0.2, 0.3]);
    expect(niceDomain(5, 5).domain).toEqual([0, 8]);
  });

  it("thins the labels and always keeps the last one", () => {
    expect(thinLabels(14, 6)).toEqual([0, 3, 6, 9, 13]);
    expect(thinLabels(4, 6)).toEqual([0, 1, 2, 3]);
  });

  it("keeps gaps as gaps, never overshoots, rounds only the data end of a bar", () => {
    expect(segments([[0, 0], null, [2, 2], [3, 3]])).toHaveLength(2);
    expect(linePath([[0, 10], [10, 0], [20, 0]], "monotone")).toMatch(/^M0,10C/);
    expect(linePath([[0, 0], [10, 5]], "step")).toBe("M0,0H5V5H10");
    expect(barPath(0, 0, 20, 100, 4)).toBe("M0,100V4Q0,0 4,0H16Q20,0 20,4V100Z");
    expect(arcPath(50, 50, 0, 40, 0, Math.PI * 2)).toContain("A40,40");
  });
});

describe("the written summary", () => {
  const table = tabulate(
    [
      { m: "2026-01", v: 10 },
      { m: "2026-02", v: 8 },
      { m: "2026-03", v: null },
      { m: "2026-04", v: 15 },
    ],
    "m",
    [{ key: "v", label: "Views" }],
  );

  it("says the extremes and the trend, skipping missing values", () => {
    const s = summarize(table.series[0]!, table.categories, String);
    expect(s).toMatchObject({ count: 3, first: 10, last: 15, trend: "up", min: { value: 8 }, max: { value: 15 } });
    expect(s.change).toBeCloseTo(0.5);
  });

  it("is written in the app's words", () => {
    const labels = mergeLabels({ summaryTrendUp: "en hausse de {change}", kinds: { line: "Courbe" } });
    const text = describeSeries(table, { kind: "line", labels, value: String, category: categoryFormatter(undefined, "fr-FR"), share: shareFormatter("fr-FR") });
    expect(nb(text)).toBe("Courbe, 4 (janv. 2026 – avr. 2026). Views: from 10 to 15, lowest 8 (févr. 2026), highest 15 (avr. 2026), en hausse de 50 %.");
    expect(DEFAULT_LABELS.kinds.line).toBe("Line chart");
  });

  it("measures a correlation", () => {
    expect(correlation([{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6.1 }])).toBeCloseTo(1, 2);
    expect(correlation([{ x: 1, y: 2 }])).toBeNull();
  });
});

// --- The palette checks of the data-viz method (OKLab ΔE ×100, Machado 2009 CVD simulation at severity 1). --------
const lin = (c: number) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
const oklab = ([r, g, b]: number[]) => {
  const l = Math.cbrt(0.4122214708 * r! + 0.5363325363 * g! + 0.0514459929 * b!);
  const m = Math.cbrt(0.2119034982 * r! + 0.6806995451 * g! + 0.1073969566 * b!);
  const s = Math.cbrt(0.0883024619 * r! + 0.2817188376 * g! + 0.6299787005 * b!);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
const linear = (hex: string) => parseColor(hex)!.map(lin);
const simulate = (rgb: number[], kind?: keyof typeof MACHADO) => (kind ? MACHADO[kind].map((row) => Math.min(1, Math.max(0, row[0]! * rgb[0]! + row[1]! * rgb[1]! + row[2]! * rgb[2]!))) : rgb);
const deltaE = (a: string, b: string, kind?: keyof typeof MACHADO) => {
  const [la, lb] = [oklab(simulate(linear(a), kind)), oklab(simulate(linear(b), kind))];
  return Math.hypot(la[0]! - lb[0]!, la[1]! - lb[1]!, la[2]! - lb[2]!) * 100;
};
const SURFACE = { dark: "#161618", light: "#ffffff" } as const;

describe.each(Object.keys(ORDERS) as (keyof typeof ORDERS)[])("the %s palette", (brand) => {
  it.each(["dark", "light"] as const)("passes the colour-vision checks on the %s surface", (mode) => {
    const colors = palette(brand, mode);
    expect(new Set(colors).size).toBe(8);
    for (let i = 0; i < colors.length - 1; i += 1) {
      const [a, b] = [colors[i]!, colors[i + 1]!];
      // Adjacent pairs (stacks, bars, lines): ≥ 15 for everyone; ≥ 8 under protan and deutan.
      expect(deltaE(a, b), `${a}↔${b} normal`).toBeGreaterThanOrEqual(15);
      expect(Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan")), `${a}↔${b} CVD`).toBeGreaterThanOrEqual(8);
    }
    // The first three slots stay apart all-pairs (scatter, maps).
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]] as const) expect(Math.min(deltaE(colors[a]!, colors[b]!, "protan"), deltaE(colors[a]!, colors[b]!, "deutan"))).toBeGreaterThanOrEqual(8);
    if (mode === "dark") for (const c of colors) expect(contrast(c, SURFACE.dark), c).toBeGreaterThanOrEqual(3);
  });

  it("leads with the brand's hue", () => {
    expect(ORDERS[brand][0]).toBe({ krizaka: "blue", orazaka: "orange" }[brand]);
  });
});

it("ramps one hue from near the surface to the full hue", () => {
  const ramp = sequential(HUES.blue.dark, SURFACE.dark, 5);
  expect(ramp).toHaveLength(5);
  expect(ramp[4]).toBe(HUES.blue.dark);
  expect(contrast(ramp[0]!, SURFACE.dark)).toBeGreaterThan(1.2);
});
