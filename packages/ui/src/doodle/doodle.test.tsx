import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { expectTypeOf } from "vitest";

import { axeViolations } from "../test/axe";
import { Doodle, type DoodleProps } from "./index";

const blocks = readFileSync(join(import.meta.dirname, "../blocks.css"), "utf8");

describe("Doodle", () => {
  it("inherits its ink token for standalone and wrapped marks", () => {
    const baseRule = /\.kz-doodle\s*\{([^}]*)\}/.exec(blocks)?.[1] ?? "";
    expect(baseRule).not.toContain("--kz-doodle-ink:");
    expect(baseRule).toContain("color: var(--kz-doodle-ink, var(--kz-paper-rule-margin))");
    expect(blocks.match(/color: var\(--kz-doodle-ink, var\(--kz-paper-rule-margin\)\)/g)).toHaveLength(2);
  });

  it("limits bird sketches to the birds with distinct drawings", () => {
    expectTypeOf<DoodleProps["bird"]>().toEqualTypeOf<"falcon" | "owl" | "duck" | "flamingo" | "pigeon" | undefined>();
  });

  it("is decoration without a label: hidden, no role, no axe violation", async () => {
    const { container } = render(<Doodle kind="arrow" />);
    const mark = container.querySelector(".kz-doodle") as HTMLElement;
    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(mark.getAttribute("role")).toBeNull();
    expect(mark.querySelector("svg path")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("carries a text equivalent as an image when it has a label", async () => {
    const { container, getByRole } = render(<Doodle kind="bird" bird="owl" label="A sketch of the owl" />);
    expect(getByRole("img").getAttribute("aria-label")).toBe("A sketch of the owl");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the word it circles or underlines as real text", () => {
    const { container, getByText } = render(
      <p>
        <Doodle kind="circle">nothing to copy</Doodle> and <Doodle kind="underline">published</Doodle>
      </p>,
    );
    expect(getByText("nothing to copy").closest(".kz-doodle")?.getAttribute("aria-hidden")).toBeNull();
    expect(container.textContent).toBe("nothing to copy and published");
    expect(container.querySelectorAll("svg[aria-hidden='true']").length).toBe(2);
  });

  it("is deterministic: the same props draw the same SVG, and each bird its own sketch", () => {
    const draw = (bird: "owl" | "duck") => render(<Doodle kind="bird" bird={bird} />).container.innerHTML;
    expect(draw("owl")).toBe(draw("owl"));
    expect(draw("owl")).not.toBe(draw("duck"));
  });
});
