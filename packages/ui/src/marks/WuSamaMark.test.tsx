import { render } from "@testing-library/react";

import { WU_SAMA as G } from "./wu-sama-geometry";
import { WuSamaMark } from "./WuSamaMark";

const pointsOf = (d: string) => [...d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
const near = (a: number, b: number) => Math.abs(a - b) < 0.11;

describe("WuSamaMark", () => {
  it("renders, is decorative by default and an image named « Wu-sama » with a title", () => {
    const { container, rerender } = render(<WuSamaMark />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<WuSamaMark title="Wu-sama" />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Wu-sama");
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
  });

  it("crops to the emblem below 48 px and draws no raster image", () => {
    const { container, rerender } = render(<WuSamaMark size={24} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(G.croppedViewBox);
    rerender(<WuSamaMark size={96} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(G.viewBox);
    expect(container.querySelector("image, foreignObject")).toBeNull();
  });

  it("reads the host's tokens for the ink and has no literal ink colour", () => {
    const { container } = render(<WuSamaMark />);
    const ink = container.querySelectorAll("[stroke^='var(--kz-'], [fill^='var(--kz-']");
    expect(ink.length).toBeGreaterThan(0);
    const colours = [...container.querySelectorAll("[stroke], [fill]")].flatMap((n) => [n.getAttribute("stroke"), n.getAttribute("fill")]).filter((c) => c && c !== "none");
    // every colour is either a token read or the mark's one gold
    for (const c of colours) expect(c!.startsWith("var(--kz-") || c === G.gold).toBe(true);
    expect(colours).toContain(G.gold);
  });

  it("is still: no animation, no class", () => {
    const { container } = render(<WuSamaMark />);
    expect(container.querySelector("style, [class]")).toBeNull();
  });
});

describe("WuSamaMark — original mark, inspired by, not derived from", () => {
  it("builds the hexagon from the Krizaka grammar: a pointy-top regular hexagon around the centre", () => {
    const [t, ur, lr, b, ll, ul] = G.hexagon;
    expect(t).toEqual([G.center, G.center - G.radius]);
    expect(b).toEqual([G.center, G.center + G.radius]);
    for (const [x, y] of G.hexagon) expect(near(Math.hypot(x - G.center, y - G.center), G.radius)).toBe(true);
    expect(near(ur[1], ul[1]) && near(lr[1], ll[1])).toBe(true);
  });

  it("derives every point of the shell from the hexagon: its vertices, or a point of an edge at the gap", () => {
    const vertices = G.hexagon.map(([x, y]) => `${x},${y}`);
    for (const d of [G.shell.left, G.shell.right]) {
      const pts = pointsOf(d);
      expect(pts).toHaveLength(4);
      // the two inner points are hexagon vertices, the ends sit on an edge at ±gap of the axis
      expect(vertices).toContain(`${pts[1]![0]},${pts[1]![1]}`);
      expect(vertices).toContain(`${pts[2]![0]},${pts[2]![1]}`);
      for (const [x] of [pts[0]!, pts[3]!]) expect(near(Math.abs(x - G.center), G.gap)).toBe(true);
    }
  });

  it("draws the W from the hexagon's measures only: five straight points, symmetric, inside the hexagon, no curve", () => {
    expect(G.w).not.toMatch(/[CcSsQqTtAa]/);
    const pts = pointsOf(G.w);
    expect(pts).toHaveLength(5);
    const u = (G.radius * Math.sqrt(3)) / 2;
    const [tl, vl, peak, vr, tr] = pts.map(([x, y]) => [x, y] as const) as [number, number][];
    expect(near(tl![0], G.center - 0.63 * u)).toBe(true);
    expect(near(tr![0], G.center + 0.63 * u)).toBe(true);
    expect(near(vl![0], G.center - 0.37 * u)).toBe(true);
    expect(near(vr![0], G.center + 0.37 * u)).toBe(true);
    expect(near(tl![1], G.center - 0.4 * G.radius)).toBe(true);
    expect(near(vl![1], G.center + 0.55 * G.radius)).toBe(true);
    expect(near(peak![0], G.center)).toBe(true);
    // two valleys under three summits, the middle one on the axis: a W of straight legs, never a bat-wing silhouette
    expect(vl![1]).toBeGreaterThan(peak![1]);
    expect(peak![1]).toBeGreaterThan(tl![1]);
    expect(vl![1]).toBe(vr![1]);
    expect(tl![1]).toBe(tr![1]);
  });

  it("keeps a closed vocabulary of paths: the shell, the W and the node — nothing else is drawn", () => {
    const { container } = render(<WuSamaMark />);
    expect(container.querySelectorAll("path")).toHaveLength(4);
  });
});
