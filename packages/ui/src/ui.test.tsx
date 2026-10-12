import { brands, marks } from "@krizaka/tokens/native";
import { render } from "@testing-library/react";

import { cx, KrizakaLogo, OrazakaLogo, OrochiaLogo, ProductLogo, RotatingWord, YazakiaLogo } from "./index";
import { KRIZAKA } from "./marks/krizaka-geometry";
import { ORAZAKA } from "./marks/orazaka-geometry";
import { OROCHIA } from "./marks/orochia-geometry";
import { YAZAKIA } from "./marks/yazakia-geometry";

describe("marks", () => {
  it.each([
    ["Krizaka", KrizakaLogo],
    ["Orazaka", OrazakaLogo],
    ["Orochia", OrochiaLogo],
    ["Yazakia", YazakiaLogo],
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

  it.each([KrizakaLogo, OrazakaLogo, OrochiaLogo, YazakiaLogo])("stops moving with animated={false} (%#)", (Mark) => {
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
  });

  it("draws the Yazakia emblem: two heads, two arms and a stem in the brand gradient, the pair on the orbit (snapshot)", async () => {
    const { container } = render(<YazakiaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelectorAll("path")).toHaveLength(YAZAKIA.arms.length + 1);
    expect(svg.querySelectorAll("circle")).toHaveLength(1 + 2 + YAZAKIA.pair.at.length + YAZAKIA.heads.length + 2);
    // The SVG, ids normalised (they are unique per instance).
    await expect(svg.outerHTML.replace(/yzm-(\w+)-[\w-]+?(?=[")])/g, "yzm-$1")).toMatchFileSnapshot("./marks/__snapshots__/YazakiaLogo.svg");
  });

  it("picks a mark by id", () => {
    const { container } = render(<ProductLogo id="orazaka" title="Orazaka" size={64} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Orazaka");
    expect(container.querySelectorAll("path")).toHaveLength(ORAZAKA.shards.length);
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
