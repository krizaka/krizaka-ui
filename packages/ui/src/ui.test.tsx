import { brands, marks } from "@krizaka/tokens/native";
import { render } from "@testing-library/react";

import { AkinazaLogo, cx, KachizakaLogo, KrizakaLogo, OrazakaLogo, OrochiaLogo, ProductLogo, RotatingWord, YasakiaLogo, YomizakaLogo, YororisLogo } from "./index";
import { AKINAZA } from "./marks/akinaza-geometry";
import { KACHIZAKA } from "./marks/kachizaka-geometry";
import { KRIZAKA } from "./marks/krizaka-geometry";
import { ORAZAKA } from "./marks/orazaka-geometry";
import { OROCHIA } from "./marks/orochia-geometry";
import { YASAKIA } from "./marks/yasakia-geometry";
import { YOMIZAKA } from "./marks/yomizaka-geometry";
import { YORORIS } from "./marks/yororis-geometry";

describe("marks", () => {
  it.each([
    ["Krizaka", KrizakaLogo],
    ["Orazaka", OrazakaLogo],
    ["Orochia", OrochiaLogo],
    ["Yasakia", YasakiaLogo],
    ["Yororis", YororisLogo],
    ["Yomizaka", YomizakaLogo],
    ["Kachizaka", KachizakaLogo],
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

  it.each([KrizakaLogo, OrazakaLogo, OrochiaLogo, YasakiaLogo, YororisLogo, YomizakaLogo, KachizakaLogo, AkinazaLogo])("stops moving with animated={false} (%#)", (Mark) => {
    const { container } = render(<Mark animated={false} />);
    expect(container.querySelector("[class]:not(svg)")).toBeNull();
    const moving = render(<Mark />);
    expect(moving.container.querySelector("[class]:not(svg)")).not.toBeNull();
  });

  it.each([
    [KrizakaLogo, KRIZAKA],
    [OrazakaLogo, ORAZAKA],
    [OrochiaLogo, OROCHIA],
    [YasakiaLogo, YASAKIA],
    [YororisLogo, YORORIS],
    [YomizakaLogo, YOMIZAKA],
    [KachizakaLogo, KACHIZAKA],
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
    expect(OROCHIA.body.stops).toEqual(marks.orochia);
    expect(KRIZAKA.blue.stops.map(([, c]) => c)).toEqual([brands.krizaka.dark.accent, brands.krizaka.dark.accentText]);
    expect(OROCHIA.body.stops[0]![1]).toBe(brands.orochia.dark.accent);
    // Orazaka: deep orange (its light accent) → orange — no amber left (#f59e0b was the old light stop).
    expect(ORAZAKA.gradient.stops[0]![1]).toBe(brands.orazaka.light.accent);
    expect(ORAZAKA.gradient.stops.map(([, c]) => c)).not.toContain("#f59e0b");
    expect(ORAZAKA.glow.color).toBe(ORAZAKA.gradient.stops.at(-1)![1]);
    // Yasakia: emerald → turquoise, the mark gradient of its brand; the halo in the turquoise end.
    expect(YASAKIA.gradient.stops).toEqual(marks.yasakia);
    expect(YASAKIA.glow.color).toBe(YASAKIA.gradient.stops.at(-1)![1]);
    // Yororis: sand → sage, the mark gradient of its brand; the halo in the sage end, the core's light rises from the sand.
    expect(YORORIS.gradient.stops).toEqual(marks.yororis);
    expect(YORORIS.glow.color).toBe(YORORIS.gradient.stops.at(-1)![1]);
    expect(YORORIS.coreGradient.stops[0][1]).toBe(YORORIS.gradient.stops[0]![1]);
    // Yomizaka: ink → indigo, the mark gradient of its brand; the halo and the lens' breath in the indigo end.
    expect(YOMIZAKA.gradient.stops).toEqual(marks.yomizaka);
    expect(YOMIZAKA.glow.color).toBe(YOMIZAKA.gradient.stops.at(-1)![1]);
    expect(YOMIZAKA.pulse.color).toBe(YOMIZAKA.glow.color);
    // Kachizaka: cobalt → gold; the halo and the seal's breath in the gold. Akinaza: forest → copper, the halo in copper.
    expect(KACHIZAKA.gradient.stops).toEqual(marks.kachizaka);
    expect(KACHIZAKA.glow.color).toBe(KACHIZAKA.gradient.stops.at(-1)![1]);
    expect(KACHIZAKA.pulse.color).toBe(KACHIZAKA.glow.color);
    expect(AKINAZA.gradient.stops).toEqual(marks.akinaza);
    expect(AKINAZA.glow.color).toBe(AKINAZA.gradient.stops.at(-1)![1]);
  });

  it("draws the Kachizaka emblem: the cup cut at its rim, the handles, the base, the seal (a star) that breathes (snapshot)", async () => {
    const { container } = render(<KachizakaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    // Handles, base, cup, star.
    expect(svg.querySelectorAll("path")).toHaveLength(4);
    // Halo, ring, orbit, the ball.
    expect(svg.querySelectorAll("circle")).toHaveLength(4);
    // The rim's corner is the Krizaka chamfer (a 45° cut); the star is a ten-point path; all inside the cropped frame.
    expect(KACHIZAKA.cup).toContain("H232 L264 136");
    expect(KACHIZAKA.star.match(/L/g)).toHaveLength(9);
    for (const n of `${KACHIZAKA.cup} ${KACHIZAKA.base} ${KACHIZAKA.handles}`.match(/\d+(\.\d+)?/g)!.map(Number)) expect(n >= 80 && n <= 320).toBe(true);
    await expect(svg.outerHTML.replace(/kzm-(\w+)-[\w-]+?(?=[")])/g, "kzm-$1")).toMatchFileSnapshot("./marks/__snapshots__/KachizakaLogo.svg");
    expect(render(<KachizakaLogo size={96} />).container.querySelector(".kzm-seal")).not.toBeNull();
  });

  it("draws the Akinaza emblem: the awning cut at its corner, its stripes, the front, the windows and the open door (snapshot)", async () => {
    const { container } = render(<AkinazaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    // Awning, stripes, front, windows; the door is a rect.
    expect(svg.querySelectorAll("path")).toHaveLength(4);
    expect(svg.querySelectorAll("rect")).toHaveLength(1);
    expect(AKINAZA.awning).toContain("H248 L276 136");
    // The door is cut out of the front, and the light fills it.
    expect(AKINAZA.front).toContain("V222 H178");
    expect(AKINAZA.door.x).toBeGreaterThan(178);
    expect(AKINAZA.door.x + AKINAZA.door.w).toBeLessThan(222);
    await expect(svg.outerHTML.replace(/akm-(\w+)-[\w-]+?(?=[")])/g, "akm-$1")).toMatchFileSnapshot("./marks/__snapshots__/AkinazaLogo.svg");
    expect(render(<AkinazaLogo size={96} />).container.querySelector(".akm-door")).not.toBeNull();
  });

  it("draws the Yomizaka emblem: a page cut at its corner and around the lens, its lines, the lens and its handle, one node on the orbit (snapshot)", async () => {
    const { container } = render(<YomizakaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    // Still: the page, its lines, the handle (and the page again, as the clip of the reading line) — no scanning line.
    expect(svg.querySelectorAll("path")).toHaveLength(3 + 1);
    expect(svg.querySelector(".ymm-scan")).toBeNull();
    // Halo, ring, orbit, the node, the lens and its glint.
    expect(svg.querySelectorAll("circle")).toHaveLength(1 + 1 + 2 + 2);
    // The cut corner is the Krizaka chamfer (a 45° cut), and the gap around the lens is wider than the lens' ring.
    expect(YOMIZAKA.page).toContain("H228 L264 128");
    expect(52).toBeGreaterThan(YOMIZAKA.lens.r + YOMIZAKA.lens.width / 2);
    // The emblem stays inside the cropped frame (80 → 320), the handle's round cap included.
    expect(304 + YOMIZAKA.handleWidth / 2).toBeLessThanOrEqual(320);
    await expect(svg.outerHTML.replace(/ymm-(\w+)-[\w-]+?(?=[")])/g, "ymm-$1")).toMatchFileSnapshot("./marks/__snapshots__/YomizakaLogo.svg");
    // Animated: the reading line scans the page, clipped to it.
    const moving = render(<YomizakaLogo size={96} />);
    expect(moving.container.querySelector(".ymm-scan")?.closest("g")?.getAttribute("clip-path")).toMatch(/^url\(#ymm-page-/);
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

  it("draws the Yasakia emblem: two voices, the left a shade deeper, a lit lens where they overlap, the pair on the orbit (snapshot)", async () => {
    const { container } = render(<YasakiaLogo size={96} animated={false} />);
    const svg = container.querySelector("svg")!;
    // Each voice: its bubble and its tail; the left one's shade; the lens and its light.
    expect(svg.querySelectorAll("path")).toHaveLength(YASAKIA.voices.length * 2 + 1 + 2);
    // Halo, ring, orbit and the pair.
    expect(svg.querySelectorAll("circle")).toHaveLength(3 + YASAKIA.pair.at.length);
    // The voices are mirrors of each other, and the lens sits on the axis.
    const [left, right] = YASAKIA.voices;
    expect(right.body.replace(/[\d.]+/g, "n")).toBe(left.body.replace(/[\d.]+/g, "n"));
    expect(YASAKIA.lens.d.startsWith("M200 ")).toBe(true);
    // The SVG, ids normalised (they are unique per instance).
    await expect(svg.outerHTML.replace(/yzm-(\w+)-[\w-]+?(?=[")])/g, "yzm-$1")).toMatchFileSnapshot("./marks/__snapshots__/YasakiaLogo.svg");
  });

  it("picks a mark by id", () => {
    const { container } = render(<ProductLogo id="orazaka" title="Orazaka" size={64} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Orazaka");
    expect(container.querySelectorAll("path")).toHaveLength(ORAZAKA.shards.length);
    const yororis = render(<ProductLogo id="yororis" title="Yororis" size={64} />);
    expect(yororis.container.querySelector("svg")?.getAttribute("aria-label")).toBe("Yororis");
    expect(yororis.container.querySelectorAll("path")).toHaveLength(YORORIS.leaves.length + 2);
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
