import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";

import { Doodle } from "../doodle";
import { SpecimenTag } from "../specimen-tag";
import { axeViolations } from "../test/axe";
import { Stuck, stuckTilt } from "./index";

describe("Stuck", () => {
  it("holds what it carries, adds no role, and has no axe violation", async () => {
    const { container } = render(
      <Stuck hold="pin" seed="akinaza">
        <SpecimenTag code="KZ-05" title="Akinaza" />
      </Stuck>,
    );
    const body = container.querySelector(".kz-stuck-body") as HTMLElement;
    expect(body.dataset.hold).toBe("pin");
    expect(body.querySelector("article.kz-tag")).toBeTruthy();
    expect(body.querySelector(".kz-stuck-pin")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".kz-stuck")?.getAttribute("role")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the pin only for a pin", () => {
    for (const hold of ["tape", "tape-corners", "corner", "glue"] as const) {
      const { container, unmount } = render(<Stuck hold={hold}>x</Stuck>);
      expect(container.querySelector(".kz-stuck-pin"), hold).toBeNull();
      expect((container.querySelector(".kz-stuck-body") as HTMLElement).dataset.hold).toBe(hold);
      unmount();
    }
  });

  it("leans deterministically: the same seed, the same tilt, within ±2°; an explicit tilt wins", () => {
    expect(stuckTilt("akinaza")).toBe(stuckTilt("akinaza"));
    for (const seed of ["", "a", "yomizaka", "kz-02", "orazaka", "x".repeat(40)]) expect(Math.abs(stuckTilt(seed))).toBeLessThanOrEqual(2);
    expect(new Set(["a", "b", "c", "d", "e", "f"].map((s) => stuckTilt(s))).size).toBeGreaterThan(2);
    const tilt = (el: Element) => (el.querySelector(".kz-stuck-body") as HTMLElement).style.getPropertyValue("--kz-stuck-tilt");
    const one = render(<Stuck seed="akinaza">x</Stuck>);
    const two = render(<Stuck seed="akinaza">x</Stuck>);
    expect(tilt(one.container)).toBe(tilt(two.container));
    expect(tilt(render(<Stuck tilt={-1.4}>x</Stuck>).container)).toBe("-1.4deg");
  });

  it("hangs its doodles beside the body, not inside the tilted block", () => {
    const { container } = render(
      <Stuck doodle={<Doodle kind="arrow" />}>
        <p>card</p>
      </Stuck>,
    );
    const doodle = container.querySelector(".kz-doodle") as HTMLElement;
    expect(doodle.parentElement).toBe(container.querySelector(".kz-stuck"));
    expect(container.querySelector(".kz-stuck-body")?.contains(doodle)).toBe(false);
  });

  it("uses themeable Cahier material and shadow roles, reserving room for each margin doodle", () => {
    const css = readFileSync(join(import.meta.dirname, "..", "blocks.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const stuck = css.match(/\.kz-stuck-body \{ position: relative;([^}]*)\}/)?.[1] ?? "";
    expect(stuck).toContain("--kz-stuck-fold: var(--kz-paper-tag)");
    expect(stuck).toContain("--kz-stuck-metal: var(--kz-paper-tag-edge)");
    expect(stuck).toContain("box-shadow: var(--kz-shadow-floating)");
    const dark = css.match(/:root:not\(\.light\) \.kz-stuck-body \{([^}]*)\}/)?.[1] ?? "";
    expect(dark).not.toContain("box-shadow");
    expect(dark).not.toContain("--kz-stuck-fold");

    const wide = css.match(/@media \(min-width: 1360px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(wide).toContain('.kz-stuck:has(> .kz-doodle[data-place="margin"][data-side="left"]) { margin-left: 96px; }');
    expect(wide).toContain('.kz-stuck:has(> .kz-doodle[data-place="margin"][data-side="right"]) { margin-right: 96px; }');
  });
});
