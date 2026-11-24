import { render } from "@testing-library/react";
import * as React from "react";

import * as glyphs from "./glyphs";

// Every glyph is decorative: a 24-unit `currentColor` svg hidden from assistive technology, sized by the caller's class.
describe("glyphs", () => {
  const all = Object.entries(glyphs) as [string, React.ComponentType<{ className?: string }>][];

  it.each(all)("%s draws a hidden 24-unit svg that takes the caller's class", (_name, Glyph) => {
    const { container } = render(<Glyph className="h-8 w-8" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("class")).toBe("h-8 w-8");
  });

  it("falls back to a 1 rem box", () => {
    const { container } = render(<glyphs.PlayGlyph />);
    expect(container.querySelector("svg")?.getAttribute("class")).toBe("h-4 w-4");
  });

  it("draws a different shape for the exit of fullscreen and for a muted volume", () => {
    const shape = (node: React.ReactElement) => render(node).container.querySelector("path")?.getAttribute("d");
    expect(shape(<glyphs.FullscreenGlyph exit />)).not.toBe(shape(<glyphs.FullscreenGlyph />));
    expect(shape(<glyphs.VolumeGlyph muted />)).toBeDefined();
  });
});
