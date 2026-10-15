import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { BIRDS, OWN_PALETTES } from "./geometry";
import { Mascot,MASCOT_BIRDS, MASCOT_MOODS } from "./index";

describe("Mascot", () => {
  it("is decorative by default and an image with a title, with no axe violation", async () => {
    const { container, rerender } = render(<Mascot />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBeNull();
    rerender(<Mascot bird="falcon" mood="success" title="Done" />);
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Done");
    expect(await axeViolations(container)).toEqual([]);
  });

  it.each(MASCOT_BIRDS.flatMap((bird) => MASCOT_MOODS.map((mood) => [bird, mood] as const)))("draws the %s %s", (bird, mood) => {
    const { container } = render(<Mascot bird={bird} mood={mood} size={40} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("data-bird")).toBe(bird);
    expect(svg?.getAttribute("data-mood")).toBe(mood);
    expect(svg?.getAttribute("width")).toBe("40");
    expect(container.querySelectorAll(".kzb-badge").length).toBe(mood === "success" || mood === "error" ? 1 : 0);
    expect(container.querySelectorAll(".kzb-dot").length).toBe(mood === "thinking" ? 3 : 0);
  });

  it("paints with the host's roles by default, its own palette with tone=own, and stops when still", () => {
    const { container, rerender } = render(<Mascot bird="owl" />);
    const stops = () => [...container.querySelectorAll("stop")].map((s) => s.getAttribute("style") ?? "");
    expect(stops().join()).toContain("var(--kz-accent)");
    expect(container.querySelector("svg")?.hasAttribute("data-animated")).toBe(true);
    rerender(<Mascot bird="owl" tone="own" animated={false} />);
    expect(stops().join()).not.toContain("var(--kz-");
    expect(container.querySelector("svg")?.hasAttribute("data-animated")).toBe(false);
  });

  it("gives every instance its own gradient, and the reduced-motion rule stops every gesture", () => {
    const { container } = render(
      <>
        <Mascot />
        <Mascot />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(2);
    expect(container.querySelector("style")?.textContent).toMatch(/prefers-reduced-motion: reduce\)[^}]*\.kzb-bird/);
  });

  it("draws every bird on the 120 grid", () => {
    for (const g of Object.values(BIRDS)) for (const [x, y] of g.eyes.at) expect(x > 0 && x < 120 && y > 0 && y < 120).toBe(true);
  });

  it("welcomes the magpie (Kachizaka: the score) and the beaver (Akinaza: the shop), each with its own palette", () => {
    expect(MASCOT_BIRDS.slice(-2)).toEqual(["magpie", "beaver"]);
    for (const bird of ["magpie", "beaver"] as const) {
      expect(OWN_PALETTES[bird]).toBeDefined();
      // A long tail or a paddle tail behind it, drawn filled in the detail colour, inside the grid.
      expect(BIRDS[bird].back?.[0]).toMatch(/Z$/);
      for (const n of BIRDS[bird].back![0]!.match(/-?\d+(\.\d+)?/g)!.map(Number)) expect(n).toBeLessThanOrEqual(120);
    }
    // The beaver's two front teeth are its "beak": the beak colour, under the nose (a detail).
    expect(BIRDS.beaver.details).toHaveLength(3);
    const { container } = render(<Mascot bird="beaver" tone="own" animated={false} />);
    expect(container.querySelector("svg")?.getAttribute("data-bird")).toBe("beaver");
  });
});
