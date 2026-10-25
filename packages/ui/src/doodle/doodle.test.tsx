import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Doodle, type DoodleKind } from "./index";

const KINDS: DoodleKind[] = ["arrow", "circle", "star", "wave", "bird"];

describe("Doodle", () => {
  it.each(KINDS)("%s is decoration: aria-hidden, a drawing, no axe violation", async (kind) => {
    const { container } = render(<Doodle kind={kind} word="ça !" />);
    const doodle = container.querySelector(".kz-doodle") as HTMLElement;
    expect(doodle.getAttribute("aria-hidden")).toBe("true");
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

  it("hides in the margin below the width where the margin disappears (blocks.css)", () => {
    const css = readFileSync(join(import.meta.dirname, "..", "blocks.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).toMatch(/\.kz-doodle \{ display: none;/);
    const wide = css.match(/@media \(min-width: 1360px\) \{([\s\S]*?)\n\}/);
    expect(wide?.[1]).toContain('.kz-doodle[data-place="margin"] { display: block; position: absolute;');
    expect(css).toContain('.kz-doodle[data-place="inline"] { display: inline-block; }');
  });
});
