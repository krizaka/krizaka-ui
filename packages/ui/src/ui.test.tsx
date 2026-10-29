import { brands, marks } from "@krizaka/tokens/native";
import { render } from "@testing-library/react";

import { AkinazaLogo, cx, KrizakaLogo, OrazakaLogo, ProductLogo, RotatingWord, YomizakaLogo } from "./index";
import { AKINAZA } from "./marks/akinaza-geometry";
import { KRIZAKA } from "./marks/krizaka-geometry";
import { ORAZAKA } from "./marks/orazaka-geometry";
import { YOMIZAKA } from "./marks/yomizaka-geometry";

describe("marks", () => {
  it.each([
    ["Krizaka", KrizakaLogo],
    ["Orazaka", OrazakaLogo],
    ["Yomizaka", YomizakaLogo],
    ["Akinaza", AkinazaLogo],
  ])("%s is decorative by default and named with a title", (name, Mark) => {
    const { container, rerender } = render(<Mark />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<Mark title={name} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe(name);
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
  });

  it("gives every instance its own gradient ids", () => {
    const { container } = render(
      <>
        <KrizakaLogo />
        <KrizakaLogo />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient, radialGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each([KrizakaLogo, OrazakaLogo, YomizakaLogo, AkinazaLogo])("stops moving with animated={false} (%#)", (Mark) => {
    const { container } = render(<Mark animated={false} />);
    expect(container.querySelector("[class]:not(svg)")).toBeNull();
    const moving = render(<Mark />);
    expect(moving.container.querySelector("[class]:not(svg)")).not.toBeNull();
  });

  it.each([
    [KrizakaLogo, KRIZAKA],
    [OrazakaLogo, ORAZAKA],
    [YomizakaLogo, YOMIZAKA],
    [AkinazaLogo, AKINAZA],
  ] as const)("shares the family frame and crops to the emblem below 48 px (%#)", (Mark, geometry) => {
    const { container, rerender } = render(<Mark size={24} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(geometry.croppedViewBox);
    rerender(<Mark size={96} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 400 400");
    expect(geometry.orbit).toEqual({ r: 160, dash: "8 8", width: 1.5 });
    expect(geometry.ring).toEqual({ r: 134, width: 1 });
  });

  it("draws each mark in its brand theme's colours (@krizaka/tokens brands)", () => {
    expect(KRIZAKA.blue.stops).toEqual(marks.krizaka);
    expect(ORAZAKA.gradient.stops).toEqual(marks.orazaka);
    expect(KRIZAKA.blue.stops.map(([, c]) => c)).toEqual([brands.krizaka.dark.accent, brands.krizaka.dark.accentText]);
    // Orazaka: deep orange (its light accent) → orange — no amber left (#f59e0b was the old light stop).
    expect(ORAZAKA.gradient.stops[0]![1]).toBe(brands.orazaka.light.accent);
    expect(ORAZAKA.gradient.stops.map(([, c]) => c)).not.toContain("#f59e0b");
    expect(ORAZAKA.glow.color).toBe(ORAZAKA.gradient.stops.at(-1)![1]);
    // Yomizaka: the brand's mark gradient; the halo and the core's breath in its last stop.
    expect(YOMIZAKA.gradient.stops).toEqual(marks.yomizaka);
    expect(YOMIZAKA.glow.color).toBe(YOMIZAKA.gradient.stops.at(-1)![1]);
    expect(YOMIZAKA.pulse.color).toBe(YOMIZAKA.glow.color);
    // Two-colour brands keep their colours apart: each colour is one stop of the brand's mark gradient, never a blend.
    expect([AKINAZA.forest, AKINAZA.copper]).toEqual(marks.akinaza.map(([, c]) => c));
    expect(AKINAZA.glow.color).toBe(AKINAZA.copper);
  });

  /** Every number of a path: the emblem stays inside the cropped frame (80 → 320), a stroke's half-width included. */
  const inFrame = (d: string, pad = 0) => d.replace(/A[\d.]+ [\d.]+ \d \d \d/g, "").match(/-?\d+(\.\d+)?/g)!.map(Number).every((n) => n - pad >= 80 && n + pad <= 320);
  const normalise = (svg: SVGSVGElement, prefix: string) => svg.outerHTML.replace(new RegExp(`${prefix}-(\\w+)-[\\w-]+?(?=[")])`, "g"), `${prefix}-$1`);

  it("draws the Yomizaka emblem: the owl, two lenses under a calm brow, the pupils lit and breathing (snapshot)", async () => {
    const { container } = render(<YomizakaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    // Halo, ring, orbit, the node, two lenses, two pupils and their lights.
    expect(svg.querySelectorAll("circle")).toHaveLength(4 + 2 + 4);
    // The brow is two curves (calm), never a sharp V of straight lines.
    expect(YOMIZAKA.brow).toMatch(/C.*C/);
    expect(YOMIZAKA.brow).not.toMatch(/L/);
    // The brow clears the lenses: its lowest point (the meeting over the beak) sits above their tops.
    const browLow = Math.max(...YOMIZAKA.brow.match(/\d+(\.\d+)?/g)!.map(Number).filter((_, i) => i % 2 === 1));
    expect(browLow + YOMIZAKA.stroke / 2).toBeLessThan(YOMIZAKA.lenses[0]!.cy - YOMIZAKA.lenses[0]!.r - YOMIZAKA.stroke / 2);
    expect(inFrame(YOMIZAKA.brow, YOMIZAKA.stroke / 2)).toBe(true);
    await expect(normalise(svg, "ymm")).toMatchFileSnapshot("./marks/__snapshots__/YomizakaLogo.svg");
    expect(render(<YomizakaLogo size={96} />).container.querySelector(".ymm-core")).not.toBeNull();
  });

  it("draws the Akinaza emblem: the log cut at 45°, its copper face, the rings inside it, the copper heart (snapshot)", async () => {
    const { container } = render(<AkinazaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelectorAll("path")).toHaveLength(2);
    // Halo, ring, orbit, the coin; two year rings; the heart and its light.
    expect(svg.querySelectorAll("circle")).toHaveLength(4 + 2 + 2);
    // The cut is a 45° chord (equal runs in x and y), and the rings stay clear of the copper face (chord at 58 from the centre).
    expect(AKINAZA.log).toContain("M197 110 L290 203");
    for (const r of AKINAZA.rings.r) expect(r + AKINAZA.rings.width / 2).toBeLessThan(58);
    expect(inFrame(AKINAZA.log)).toBe(true);
    await expect(normalise(svg, "akm")).toMatchFileSnapshot("./marks/__snapshots__/AkinazaLogo.svg");
    expect(render(<AkinazaLogo size={96} />).container.querySelector(".akm-core")).not.toBeNull();
  });

  it("picks a mark by id", () => {
    const { container } = render(<ProductLogo id="orazaka" title="Orazaka" size={64} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Orazaka");
    expect(container.querySelectorAll("path")).toHaveLength(ORAZAKA.shards.length);
    const yomizaka = render(<ProductLogo id="yomizaka" title="Yomizaka" size={64} animated={false} />);
    expect(yomizaka.container.querySelector("svg")?.getAttribute("aria-label")).toBe("Yomizaka");
  });
});

describe("motion", () => {
  it("shows the first word and hides the roll from assistive tech", () => {
    window.matchMedia = ((q: string) => ({ matches: false, media: q })) as unknown as typeof window.matchMedia;
    const { container } = render(<RotatingWord words={["love", "follow"]} />);
    // Every word shares the cell from the first paint (no layout shift); only the first is visible.
    expect(container.textContent).toBe("lovefollow");
    expect(container.querySelector("[data-active=true]")?.textContent).toBe("love");
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("joins class names", () => {
    expect(cx("a", false, null, "b", undefined)).toBe("a b");
  });
});
