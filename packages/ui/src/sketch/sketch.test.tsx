import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, vi } from "vitest";

import BeforeAfter from "../../registry/examples/sketch/before-after";
import Desktop from "../../registry/examples/sketch/desktop";
import Hatch from "../../registry/examples/sketch/hatch";
import Phone from "../../registry/examples/sketch/phone";
import { axeViolations } from "../test/axe";
import { Sketch, SketchIconError, SketchPair, sketchProblems, type SketchSpec } from "./index";

const spec: SketchSpec = {
  width: 400,
  height: 300,
  seed: 4,
  shapes: [
    { kind: "box", x: 10, y: 10, w: 200, h: 100, fill: "soft" },
    { kind: "button", x: 10, y: 200, w: 120, h: 40, variant: "primary", label: "Go" },
    { kind: "lines", x: 220, y: 20, w: 160, count: 3 },
    { kind: "arrow", from: [220, 150], to: [300, 200] },
    { kind: "icon", x: 300, y: 250, name: "search" },
    { kind: "hatch", x: 220, y: 60, w: 160, h: 60 },
  ],
  callouts: [{ n: 1, at: [70, 220], from: [-30, 260], arrow: true }, { n: 2, at: [100, 60] }],
};
const legend = [
  { n: 1, label: "Go", text: "the action." },
  { n: 2, label: "The card", text: "what the page is about." },
];
const markup = (s: SketchSpec) => renderToStaticMarkup(<Sketch title="A screen" spec={s} legend={legend} />);

afterEach(() => vi.restoreAllMocks());

describe("Sketch", () => {
  it("draws the same SVG for the same spec and seed, a different one for another seed", () => {
    expect(markup(spec)).toBe(markup(structuredClone(spec)));
    expect(markup({ ...spec, seed: 5 })).not.toBe(markup(spec));
  });

  it("moves no other shape's strokes when a shape is added", () => {
    const paths = (s: SketchSpec) => renderToStaticMarkup(<Sketch title="t" spec={s} legend={legend} />).match(/class="kz-sketch-wash" data-fill="soft" d="[^"]+"/)?.[0];
    expect(paths({ ...spec, shapes: [...spec.shapes, { kind: "line", from: [0, 0], to: [10, 10] }] })).toBe(paths(spec));
  });

  it("is one image named by its title, the legend an ordered list numbered like the callouts, with no axe violation", async () => {
    const { container } = render(<Sketch title="A screen" spec={spec} legend={legend} caption="Fig. 1 — a screen" />);
    const svg = screen.getByRole("img", { name: "A screen" });
    expect(svg.getAttribute("aria-label")).toBe("A screen");
    // One <title> per page (the family SEO contract, krizaka-com AGENTS.md §2.4): the drawing is named by aria-label only.
    expect(container.querySelectorAll("title")).toHaveLength(0);
    expect([...container.querySelectorAll("ol.kz-sketch-legend li")].map((li) => (li as HTMLLIElement).value)).toEqual([1, 2]);
    const badges = [...container.querySelectorAll(".kz-sketch-badge")];
    expect(badges.map((b) => [b.textContent, b.getAttribute("aria-hidden")])).toEqual([["1", "true"], ["2", "true"]]);
    expect(screen.getByText("Fig. 1 — a screen").tagName).toBe("FIGCAPTION");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("frames the whole drawing: a callout in the margin widens the view box", () => {
    const box = (s: SketchSpec) => /viewBox="(-?\d+) /.exec(markup(s))?.[1];
    expect(Number(box(spec))).toBeLessThan(-30 - 11);
    expect(Number(box({ ...spec, callouts: [{ n: 1, at: [70, 220] }, { n: 2, at: [100, 60] }] }))).toBeGreaterThan(-30);
  });

  it("pairs every callout with a legend line and the reverse, and warns in development when they do not", () => {
    expect(sketchProblems(spec, legend)).toEqual([]);
    expect(sketchProblems(spec, [legend[0]!, { n: 3, label: "x", text: "y" }])).toEqual([
      "callout 2 has no legend line",
      "legend line 3 has no callout",
    ]);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Sketch title="Unpaired" spec={spec} legend={[legend[0]!]} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("callout 2 has no legend line"));
  });

  it("refuses an icon @krizaka/icons does not have", () => {
    const bad: SketchSpec = { ...spec, shapes: [{ kind: "icon", x: 0, y: 0, name: "not-an-icon" }] };
    expect(() => markup(bad)).toThrow(SketchIconError);
    expect(() => markup({ ...spec, shapes: [{ kind: "icon", x: 0, y: 0, name: "toString" }] })).toThrow(SketchIconError);
  });

  it("places each number in HTML over its point, a fixed size at any width", () => {
    const html = markup({ ...spec, frame: "none", callouts: [{ n: 1, at: [0, 0] }, { n: 2, at: [400, 300] }] });
    const [, vx, vy, vw, vh] = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(html)!.map(Number);
    const pct = (v: number, o: number, l: number) => `${Math.round(((v - o) / l) * 1e4) / 100}%`;
    expect(html).toContain(`left:${pct(0, vx!, vw!)};top:${pct(0, vy!, vh!)}`);
    expect(html).toContain(`left:${pct(400, vx!, vw!)};top:${pct(300, vy!, vh!)}`);
  });

  it("draws a phone's outline, a plain frame, or none", () => {
    const d = (frame: SketchSpec["frame"]) => markup({ ...spec, frame, shapes: [], callouts: [] });
    expect(d("phone")).toContain("A22 22 0 0 1 ");
    expect(d("desktop")).not.toContain("A22 22 0 0 1 ");
    expect(d("none")).not.toMatch(/class="kz-sketch-ink" d="/);
  });

  it("puts two sketches under their notes", () => {
    const { container } = render(<SketchPair beforeLabel="before" afterLabel="after" before={{ title: "Before", spec }} after={{ title: "After", spec }} />);
    expect([...container.querySelectorAll(".kz-sketch-side-label")].map((p) => p.textContent)).toEqual(["before", "after"]);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it.each([["desktop", Desktop], ["phone", Phone], ["hatch", Hatch], ["before-after", BeforeAfter]])("renders the %s example with every callout paired", async (_name, Example) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<Example />);
    expect(warn).not.toHaveBeenCalled();
    expect(await axeViolations(container)).toEqual([]);
  });
});
