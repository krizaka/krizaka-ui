import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Mascot } from "../mascots";
import { SpeedLines } from "./index";

const blocks = readFileSync(join(import.meta.dirname, "../blocks.css"), "utf8");

describe("SpeedLines", () => {
  it("hides the lines and keeps its content real, with no axe violation", async () => {
    const { container, getByRole } = render(
      <SpeedLines>
        <h1>2.0.0 is out</h1>
      </SpeedLines>,
    );
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(getByRole("heading", { name: "2.0.0 is out" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is deterministic and draws as many lines as asked, within bounds", () => {
    const html = (count: number) => render(<SpeedLines count={count} />).container.innerHTML;
    expect(html(20)).toBe(html(20));
    const lines = (count: number, kind: "radial" | "horizontal") => render(<SpeedLines kind={kind} count={count} />).container.querySelectorAll(kind === "radial" ? "polygon" : "rect").length;
    expect(lines(20, "radial")).toBe(20);
    expect(lines(20, "horizontal")).toBe(20);
    expect(lines(1, "radial")).toBe(4);
    expect(lines(900, "radial")).toBe(120);
  });

  it("only pulses when asked (and the stylesheet stops it under reduced motion)", () => {
    expect((render(<SpeedLines />).container.firstChild as HTMLElement).dataset.speedAnimated).toBeUndefined();
    expect((render(<SpeedLines animated />).container.firstChild as HTMLElement).dataset.speedAnimated).toBe("");
    expect(blocks).toContain(".kz-speed[data-speed-animated] .kz-speed-lines");
  });

  it("does not activate animations in its child mascots", () => {
    const { container } = render(
      <SpeedLines animated>
        <Mascot animated={false} />
      </SpeedLines>,
    );
    expect(container.querySelector(".kz-speed")?.hasAttribute("data-animated")).toBe(false);
    expect(container.querySelector(".kz-speed-content > svg")?.hasAttribute("data-animated")).toBe(false);
  });
});
