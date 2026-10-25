import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { expectTypeOf } from "vitest";

import { axeViolations } from "../test/axe";
import { Doodle, type DoodleKind, type DoodleProps } from "./index";

const KINDS: DoodleKind[] = ["arrow", "circle", "star", "wave", "bird"];
const css = readFileSync(join(import.meta.dirname, "..", "blocks.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("Doodle", () => {
  it.each(KINDS)("%s is decoration: aria-hidden, a drawing, no axe violation", async (kind) => {
    const { container } = render(<Doodle kind={kind} word="ça !" />);
    const doodle = container.querySelector(".kz-doodle") as HTMLElement;
    expect(doodle.getAttribute("aria-hidden")).toBe("true");
    expect(doodle.getAttribute("role")).toBeNull();
    expect(doodle.dataset.kind).toBe(kind);
    expect(doodle.querySelectorAll("svg path").length).toBeGreaterThan(0);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("rings a word only for a circle, sits in the left margin of the block by default", () => {
    const { container } = render(<Doodle kind="circle" word="ça !" />);
    expect(container.querySelector(".kz-doodle-word")?.textContent).toBe("ça !");
    const star = render(<Doodle kind="star" word="no" side="right" top="12px" />).container.querySelector(".kz-doodle") as HTMLElement;
    expect(star.querySelector(".kz-doodle-word")).toBeNull();
    expect(star.dataset.side).toBe("right");
    expect(star.style.getPropertyValue("--kz-doodle-top")).toBe("12px");
    expect((container.querySelector(".kz-doodle") as HTMLElement).dataset.place).toBe("margin");
  });

  it("is drawn the same every time: the tilt comes from the seed", () => {
    const tilt = (seed: string) => (render(<Doodle kind="star" seed={seed} />).container.querySelector(".kz-doodle") as HTMLElement).style.getPropertyValue("--kz-doodle-tilt");
    expect(tilt("a")).toBe(tilt("a"));
    expect(tilt("a")).toMatch(/^-?\d(\.\d)?deg$/);
    expect(Math.abs(parseFloat(tilt("akinaza")))).toBeLessThanOrEqual(8);
  });

  it("carries a text equivalent as an image when it has a label; a flipped mark faces the other way", async () => {
    const { container, getByRole } = render(<Doodle kind="bird" bird="owl" place="inline" flip label="A sketch of the owl" />);
    const doodle = container.querySelector(".kz-doodle") as HTMLElement;
    expect(getByRole("img").getAttribute("aria-label")).toBe("A sketch of the owl");
    expect(doodle.getAttribute("aria-hidden")).toBeNull();
    expect(doodle.hasAttribute("data-flip")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the word it circles or underlines as real text, in the flow, the ink hidden over it", async () => {
    const { container, getByText } = render(
      <p>
        <Doodle kind="circle">nothing to copy</Doodle> and <Doodle kind="wave">published</Doodle>
      </p>,
    );
    const ring = getByText("nothing to copy").closest(".kz-doodle") as HTMLElement;
    expect(ring.getAttribute("aria-hidden")).toBeNull();
    expect(ring.dataset.place).toBe("inline");
    expect(ring.hasAttribute("data-wrap")).toBe(true);
    expect(container.textContent).toBe("nothing to copy and published");
    expect(container.querySelectorAll(".kz-doodle-ink[aria-hidden='true'] svg[preserveAspectRatio='none']").length).toBe(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("sketches each bird its own way, the duck by default, and only the birds that have a sketch", () => {
    const draw = (bird?: DoodleProps["bird"]) => render(<Doodle kind="bird" bird={bird} />).container.querySelector("svg")!.outerHTML;
    expect(draw("owl")).toBe(draw("owl"));
    expect(draw("owl")).not.toBe(draw("duck"));
    expect(draw(undefined)).toBe(draw("duck"));
    expect(new Set(["falcon", "owl", "duck", "flamingo", "pigeon"].map((b) => draw(b as DoodleProps["bird"]))).size).toBe(5);
    expectTypeOf<DoodleProps["bird"]>().toEqualTypeOf<"falcon" | "owl" | "duck" | "flamingo" | "pigeon" | undefined>();
  });

  it("hides in the margin below the width where the margin disappears (blocks.css)", () => {
    expect(css).toMatch(/\.kz-doodle \{ display: none;/);
    const wide = css.match(/@media \(min-width: 1360px\) \{([\s\S]*?)\n\}/);
    expect(wide?.[1]).toContain('.kz-doodle[data-place="margin"] { display: block; position: absolute;');
    expect(css).toContain('.kz-doodle[data-place="inline"] { display: inline-block; }');
  });

  it("inks every mark from one token, --kz-doodle-ink, the margin's red by default; a wrapped word keeps its own colour", () => {
    const base = /\.kz-doodle \{([^}]*)\}/.exec(css)?.[1] ?? "";
    expect(base).not.toContain("--kz-doodle-ink:");
    expect(base).toContain("color: var(--kz-doodle-ink, var(--kz-paper-rule-margin))");
    expect(css.match(/color: var\(--kz-doodle-ink, var\(--kz-paper-rule-margin\)\)/g)).toHaveLength(2);
    expect(/\.kz-doodle\[data-wrap\] \{([^}]*)\}/.exec(css)?.[1]).toContain("color: inherit");
  });
});
