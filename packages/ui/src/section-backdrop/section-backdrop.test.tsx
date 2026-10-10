import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SectionBackdrop } from "./index";

describe("SectionBackdrop", () => {
  it("renders a section with its layers hidden from assistive technology, with no axe violation", async () => {
    const { container } = render(
      <main>
        <SectionBackdrop grid media={<span>art</span>} aria-label="Hero">
          <h2>Title</h2>
        </SectionBackdrop>
      </main>,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("kz-backdrop");
    expect(section?.getAttribute("data-direction")).toBe("down");
    const layers = container.querySelectorAll("[data-backdrop-layer]");
    expect(layers).toHaveLength(4);
    for (const layer of layers) expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("drops the drift when still, the dome on demand, and takes another element", () => {
    const { container } = render(<SectionBackdrop as="header" animated={false} dome={false} direction="up" className="py-8" />);
    const header = container.querySelector("header");
    expect(header?.getAttribute("data-direction")).toBe("up");
    expect(header?.className).toContain("py-8");
    expect(container.querySelectorAll("[data-backdrop-layer]")).toHaveLength(0);
  });

  it("is drawn by motion.css from the brand tokens, and still under reduced motion", () => {
    const css = readFileSync(join(import.meta.dirname, "../motion.css"), "utf8");
    expect(css).toContain("var(--kz-brand-gradient-from)");
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\n[^}]*\.kz-backdrop-drift/);
  });
});
