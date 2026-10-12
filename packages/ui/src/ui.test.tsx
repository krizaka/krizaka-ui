import { brands, marks } from "@krizaka/tokens/native";
import { render } from "@testing-library/react";

import { cx, KrizakaLogo, OrazakaLogo, OrochiaLogo, ProductLogo, RotatingWord, YazakiaLogo, YororisLogo } from "./index";
import { KRIZAKA } from "./marks/krizaka-geometry";
import { ORAZAKA } from "./marks/orazaka-geometry";
import { OROCHIA } from "./marks/orochia-geometry";
import { YAZAKIA } from "./marks/yazakia-geometry";
import { YORORIS } from "./marks/yororis-geometry";

describe("marks", () => {
  it.each([
    ["Krizaka", KrizakaLogo],
    ["Orazaka", OrazakaLogo],
    ["Orochia", OrochiaLogo],
    ["Yazakia", YazakiaLogo],
    ["Yororis", YororisLogo],
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

  it.each([KrizakaLogo, OrazakaLogo, OrochiaLogo, YazakiaLogo, YororisLogo])("stops moving with animated={false} (%#)", (Mark) => {
    const { container } = render(<Mark animated={false} />);
    expect(container.querySelector("[class]:not(svg)")).toBeNull();
    const moving = render(<Mark />);
    expect(moving.container.querySelector("[class]:not(svg)")).not.toBeNull();
  });

  it.each([
    [KrizakaLogo, KRIZAKA],
    [OrazakaLogo, ORAZAKA],
    [OrochiaLogo, OROCHIA],
    [YazakiaLogo, YAZAKIA],
    [YororisLogo, YORORIS],
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
    expect(OROCHIA.body.stops).toEqual(marks.orochia);
    expect(KRIZAKA.blue.stops.map(([, c]) => c)).toEqual([brands.krizaka.dark.accent, brands.krizaka.dark.accentText]);
    expect(OROCHIA.body.stops[0]![1]).toBe(brands.orochia.dark.accent);
    // Orazaka: deep orange (its light accent) → orange — no amber left (#f59e0b was the old light stop).
    expect(ORAZAKA.gradient.stops[0]![1]).toBe(brands.orazaka.light.accent);
    expect(ORAZAKA.gradient.stops.map(([, c]) => c)).not.toContain("#f59e0b");
    expect(ORAZAKA.glow.color).toBe(ORAZAKA.gradient.stops.at(-1)![1]);
    // Yazakia: emerald → turquoise, the mark gradient of its brand; the halo in the turquoise end.
    expect(YAZAKIA.gradient.stops).toEqual(marks.yazakia);
    expect(YAZAKIA.glow.color).toBe(YAZAKIA.gradient.stops.at(-1)![1]);
    // Yororis: sand → sage, the mark gradient of its brand; the halo in the sage end, the core's light rises from the sand.
    expect(YORORIS.gradient.stops).toEqual(marks.yororis);
    expect(YORORIS.glow.color).toBe(YORORIS.gradient.stops.at(-1)![1]);
    expect(YORORIS.coreGradient.stops[0][1]).toBe(YORORIS.gradient.stops[0]![1]);
  });

  it("draws the Yororis emblem: two filled leaves and a stem in the brand gradient, the core held inside them, one node on the orbit (snapshot)", async () => {
    const { container } = render(<YororisLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelectorAll("path")).toHaveLength(1 + YORORIS.leaves.length + 1);
    expect(svg.querySelectorAll("circle")).toHaveLength(1 + 2 + 1 + 2);
    // The core rests in the hollow of the leaves, above the stem's junction.
    expect(YORORIS.core.cy + YORORIS.core.r).toBeLessThan(244);
    await expect(svg.outerHTML.replace(/yrm-(\w+)-[\w-]+?(?=[")])/g, "yrm-$1")).toMatchFileSnapshot("./marks/__snapshots__/YororisLogo.svg");
  });

  it("draws the Yazakia emblem: two voices, the left a shade deeper, a lit lens where they overlap, the pair on the orbit (snapshot)", async () => {
    const { container } = render(<YazakiaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    // Each voice: its bubble and its tail; the left one's shade; the lens and its light.
    expect(svg.querySelectorAll("path")).toHaveLength(YAZAKIA.voices.length * 2 + 1 + 2);
    // Halo, ring, orbit and the pair.
    expect(svg.querySelectorAll("circle")).toHaveLength(3 + YAZAKIA.pair.at.length);
    // The voices are mirrors of each other, and the lens sits on the axis.
    const [left, right] = YAZAKIA.voices;
    expect(right.body.replace(/[\d.]+/g, "n")).toBe(left.body.replace(/[\d.]+/g, "n"));
    expect(YAZAKIA.lens.d.startsWith("M200 ")).toBe(true);
    // The SVG, ids normalised (they are unique per instance).
    await expect(svg.outerHTML.replace(/yzm-(\w+)-[\w-]+?(?=[")])/g, "yzm-$1")).toMatchFileSnapshot("./marks/__snapshots__/YazakiaLogo.svg");
  });

  it("picks a mark by id", () => {
    const { container } = render(<ProductLogo id="orazaka" title="Orazaka" size={64} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Orazaka");
    expect(container.querySelectorAll("path")).toHaveLength(ORAZAKA.shards.length);
    const yororis = render(<ProductLogo id="yororis" title="Yororis" size={64} />);
    expect(yororis.container.querySelector("svg")?.getAttribute("aria-label")).toBe("Yororis");
    expect(yororis.container.querySelectorAll("path")).toHaveLength(YORORIS.leaves.length + 2);
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
