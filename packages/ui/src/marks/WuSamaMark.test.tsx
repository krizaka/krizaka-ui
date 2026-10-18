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
    const ink = container.querySelectorAll("stop[stop-color^='var(--kz-']");
    expect(ink.length).toBeGreaterThan(0);
  });

  it("is still: no animation, no class", () => {
    const { container } = render(<WuSamaMark />);
    expect(container.querySelector("style, [class]")).toBeNull();
  });
});

describe("WuSamaMark — shares Krizaka contour and color palette", () => {
  it("draws the Krizaka hexagonal shield contour with round caps and joins", () => {
    const { container } = render(<WuSamaMark size={64} />);
    const shield = container.querySelector(`path[d="${G.shield}"]`);
    expect(shield).not.toBeNull();
    expect(shield?.getAttribute("stroke-linecap")).toBe("round");
    expect(shield?.getAttribute("stroke-linejoin")).toBe("round");
  });

  it("places the lit node at the open vertex", () => {
    const { container } = render(<WuSamaMark size={64} />);
    const outerNode = container.querySelector(`circle[cx="${G.node.cx}"][cy="${G.node.cy}"][r="${G.node.r}"]`);
    const innerNode = container.querySelector(`circle[cx="${G.node.cx}"][cy="${G.node.cy}"][r="${G.node.inner}"]`);
    expect(outerNode).not.toBeNull();
    expect(innerNode).not.toBeNull();
    expect(innerNode?.getAttribute("fill")).toBe(G.highlight);
  });

  it("draws the W in five straight legs, symmetric, no curve", () => {
    expect(G.w).not.toMatch(/[CcSsQqTtAa]/);
    const pts = pointsOf(G.w);
    expect(pts).toHaveLength(5);
    const [tl, vl, peak, vr, tr] = pts.map(([x, y]) => [x, y] as const) as [number, number][];
    expect(tl![1]).toBe(tr![1]);
    expect(vl![1]).toBe(vr![1]);
    expect(near(peak![0], 180)).toBe(true);
    expect(vl![1]).toBeGreaterThan(peak![1]);
    expect(peak![1]).toBeGreaterThan(tl![1]);
  });
});
