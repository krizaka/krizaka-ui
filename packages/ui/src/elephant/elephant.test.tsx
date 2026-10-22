import { themes } from "@krizaka/tokens/native";
import { render } from "@testing-library/react";

import { ELEPHANT, SAGE, SAND } from "./geometry";
import { Elephant } from "./index";

/** WCAG relative luminance and contrast of two #rrggbb colours. */
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

describe("Elephant", () => {
  it("is decorative by default and an image with a title", () => {
    const { container, rerender } = render(<Elephant />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<Elephant title="An elephant" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("An elephant");
  });

  it("draws the two poses: standing with the ear folded, flying with the ear spread as a wing and the wind behind", () => {
    const standing = render(<Elephant pose="standing" size={96} />).container.querySelector("svg")!;
    expect(standing.getAttribute("data-pose")).toBe("standing");
    expect(standing.getAttribute("width")).toBe("96");
    expect(standing.querySelectorAll("path")).toHaveLength(4); // body, trunk, tail, ear
    const flying = render(<Elephant pose="flying" />).container.querySelector("svg")!;
    expect(flying.getAttribute("data-pose")).toBe("flying");
    expect(flying.querySelectorAll("path")).toHaveLength(5); // + the wind
    // The wing rises above the back (y of the body's back is 74); the folded ear never does.
    const top = (d: string) => Math.min(...(d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number).filter((_, i) => i % 2 === 1));
    expect(top(ELEPHANT.flying.ear)).toBeLessThan(40);
    expect(top(ELEPHANT.standing.ear)).toBeGreaterThanOrEqual(40);
  });

  it("flaps only when flying and animated, and never under animated={false}", () => {
    expect(render(<Elephant pose="flying" />).container.querySelector(".kz-elephant-flap")).not.toBeNull();
    expect(render(<Elephant pose="flying" animated={false} />).container.querySelector(".kz-elephant-flap")).toBeNull();
    expect(render(<Elephant pose="standing" />).container.querySelector(".kz-elephant-flap")).toBeNull();
    const css = render(<Elephant pose="flying" />).container.querySelector("style")!.textContent!;
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps the Krizaka line: a pen stroke with square caps and mitred joins, flat colours, no glow and no gradient", () => {
    const { container } = render(<Elephant pose="flying" />);
    for (const path of container.querySelectorAll("path")) {
      expect(path.getAttribute("stroke-linecap")).toBe("square");
      expect(path.getAttribute("stroke-linejoin")).toBe("miter");
      expect(path.getAttribute("fill")).toBe("none");
    }
    expect(container.innerHTML).not.toMatch(/gradient|filter|drop-shadow|blur|<defs/i);
    expect(ELEPHANT.stroke).toBe(8);
  });

  it("stays inside its 200 × 200 frame, a stroke's half-width included", () => {
    const half = ELEPHANT.stroke / 2;
    for (const pose of [ELEPHANT.standing, ELEPHANT.flying]) {
      for (const d of Object.values(pose)) {
        const numbers = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
        for (const n of numbers) {
          expect(n - half).toBeGreaterThanOrEqual(0);
          expect(n + half).toBeLessThanOrEqual(200);
        }
      }
    }
  });

  it("reads on both themes: sage and sand reach 3:1 on the page surface, dark and light", () => {
    for (const mode of ["dark", "light"] as const) {
      const surface = themes[mode].surface0;
      expect(contrast(SAGE, surface), `sage on ${mode}`).toBeGreaterThanOrEqual(3);
      expect(contrast(SAND, surface), `sand on ${mode}`).toBeGreaterThanOrEqual(3);
    }
  });
});
