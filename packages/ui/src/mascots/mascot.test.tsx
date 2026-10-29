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

  it("welcomes the magpie (the score) and the beaver (the shop), each with its own palette", () => {
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

describe("Mascot life", () => {
  it("is off by default: nothing marks the bird as living", () => {
    const { container } = render(<Mascot bird="owl" />);
    const svg = container.querySelector("svg");
    expect(svg?.hasAttribute("data-life")).toBe(false);
    expect(svg?.getAttribute("style")).toBeNull();
  });

  it("lives in character: a phase of its own, no wave of the welcome (the motion is blocks.css's)", () => {
    const { container } = render(
      <>
        <Mascot bird="owl" life phase={0.25} />
        <Mascot bird="pigeon" life />
        <Mascot bird="pigeon" life />
      </>,
    );
    const [owl, p1, p2] = [...container.querySelectorAll("svg")];
    expect(owl!.hasAttribute("data-life")).toBe(true);
    expect(owl!.getAttribute("style")).toContain("--kzb-ph: 0.25");
    // The right wing is not raised in a wave: the welcome is the bird at ease.
    expect(owl!.querySelector(".kzb-wing-r")?.getAttribute("style")).not.toContain("rotate(-20deg)");
    // Two pigeons never move together.
    expect(p1!.getAttribute("style")).not.toBe(p2!.getAttribute("style"));
  });

  it("looks where it is told, flies, and jumps when poked — and only when it lives", () => {
    const { container, rerender } = render(<Mascot bird="duck" life look="left" flying poked bank={-1} />);
    let svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-look")).toBe("left");
    expect(svg.hasAttribute("data-flying")).toBe(true);
    expect(svg.hasAttribute("data-poked")).toBe(true);
    rerender(<Mascot bird="duck" look="left" flying poked />);
    svg = container.querySelector("svg")!;
    expect(svg.hasAttribute("data-look")).toBe(false);
    expect(svg.hasAttribute("data-flying")).toBe(false);
    rerender(<Mascot bird="duck" life mood="success" look="left" />);
    expect(container.querySelector("svg")!.hasAttribute("data-life")).toBe(false); // a mood has its own gesture
  });

  it("stops every motion of its life under reduced motion", () => {
    const { container } = render(<Mascot bird="falcon" life />);
    const css = container.querySelector("style")!.textContent!;
    expect(css).toMatch(/prefers-reduced-motion: reduce\)[^}]*\.kzb-head/);
    expect(css).toMatch(/\.kzb-look, \.kzb-pupil \{ transition: none !important; transform: none !important/);
    expect(css).toMatch(/\.kzb-wing,/);
  });
});
