import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { EngineFlow, type EngineFlowNode,flowGeometry, flowPositions } from "./index";

const nodes: EngineFlowNode[] = [
  { id: "a", label: "Alpha", flow: "both", description: "Search, results back.", href: "https://a.example", linkLabel: "a.example", className: "brand-a" },
  { id: "b", label: "Beta", flow: "in", description: "Documents in." },
  { id: "c", label: "Gamma", planned: true, status: "planned", description: "Not wired yet." },
];
const flow = <EngineFlow label="The engine and its apps" hub={{ label: "Hub", caption: "the engine" }} nodes={nodes} hint="Point at an app." />;

describe("EngineFlow geometry", () => {
  it("places the hub at the centre and the nodes around it, inside the box, for every layout", () => {
    for (const layout of ["radial", "top-to-bottom", "left-to-right"] as const) {
      const g = flowGeometry(layout, 6);
      expect(g.nodes).toHaveLength(6);
      expect(g.paths).toHaveLength(6);
      for (const p of [...g.nodes, g.hub]) {
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(g.width);
        expect(p.y).toBeGreaterThan(0);
        expect(p.y).toBeLessThan(g.height);
      }
      for (const l of g.lengths) expect(l).toBeGreaterThan(5);
    }
    expect(flowGeometry("radial", 6).hub).toEqual({ x: 50, y: 30 });
  });

  it("radial: an even count puts two nodes level with the hub; top-to-bottom: the nodes in one row above it", () => {
    const radial = flowPositions("radial", 6);
    expect(radial.nodes.filter((p) => Math.abs(p.y - radial.hub.y) < 0.01)).toHaveLength(2);
    const column = flowPositions("top-to-bottom", 6);
    expect(new Set(column.nodes.map((p) => p.y)).size).toBe(1);
    expect(column.nodes.every((p) => p.y < column.hub.y)).toBe(true);
  });

  it("draws an S-shaped Bézier by default and a line on demand, from the node to the hub", () => {
    const g = flowGeometry("left-to-right", 2);
    expect(g.paths[0]).toMatch(/^M12 14 C/);
    expect(flowGeometry("left-to-right", 2, "straight").paths[0]).toMatch(/^M12 14 L80 /);
  });
});

describe("EngineFlow", () => {
  it("is a named figure of buttons, its drawing hidden, with no axe violation", async () => {
    const { container } = render(flow);
    expect(screen.getByRole("figure", { name: "The engine and its apps" })).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    // The wide stage and the phone's: each node is a button in both (one of them hidden by a container query).
    expect(screen.getAllByRole("button", { name: "Alpha", hidden: true })).toHaveLength(2);
    expect(screen.getByText("Point at an app.")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("photons only where something runs: both ways for `both`, none for a planned node", () => {
    const { container } = render(<EngineFlow label="x" hub={{ label: "Hub" }} nodes={nodes} compactLayout={false} />);
    const link = (id: string) => container.querySelectorAll(".kz-flow-link")[nodes.findIndex((n) => n.id === id)]!;
    const dirs = (id: string) => [...new Set([...link(id).querySelectorAll(".kz-flow-photon")].map((p) => p.getAttribute("data-dir")))];
    expect(dirs("a")).toEqual(["in", "out"]);
    expect(dirs("b")).toEqual(["in"]);
    expect(dirs("c")).toEqual([]);
    expect(link("c").hasAttribute("data-planned")).toBe(true);
    expect(link("a").getAttribute("class")).toContain("brand-a");
    const none = render(<EngineFlow label="y" hub={{ label: "Hub" }} nodes={nodes} particles="none" />);
    expect(none.container.querySelectorAll(".kz-flow-photon")).toHaveLength(0);
  });

  it("pointing at or focusing a node says its line and its link in the detail line", async () => {
    const user = userEvent.setup();
    render(<EngineFlow label="x" hub={{ label: "Hub" }} nodes={nodes} compactLayout={false} hint="Point at an app." />);
    await user.tab();
    const alpha = screen.getByRole("button", { name: "Alpha" });
    expect(document.activeElement).toBe(alpha);
    expect(alpha.getAttribute("aria-pressed")).toBe("true");
    const detail = document.getElementById(alpha.getAttribute("aria-controls")!)!;
    expect(detail.getAttribute("aria-live")).toBe("polite");
    expect(detail.textContent).toContain("Search, results back.");
    expect(screen.getByRole("link", { name: /a\.example/ }).getAttribute("href")).toBe("https://a.example");
    await user.hover(screen.getByRole("button", { name: "Gamma" }));
    expect(detail.textContent).toContain("planned");
    expect(detail.textContent).toContain("Not wired yet.");
  });

  it("joins the motion system: an off-screen scope, loops held while the page settles, still under reduced motion, no frame loop", () => {
    const { container } = render(flow);
    expect(container.querySelector("figure")?.hasAttribute("data-motion-scope")).toBe(true);
    expect(container.querySelector(".kz-flow-photon")?.getAttribute("class")).toContain("kz-loop");
    const css = readFileSync(join(import.meta.dirname, "../motion.css"), "utf8");
    expect(css).toMatch(/prefers-reduced-motion: reduce[^]*\.kz-flow-photon \{ animation: none !important; \}|\.kz-flow-photon \{ animation: none/);
    const source = readFileSync(join(import.meta.dirname, "engine-flow.tsx"), "utf8");
    expect(source).not.toMatch(/requestAnimationFrame|<canvas|getContext/);
  });
});

describe("EngineFlow photons actually move (regression: they sat still on every site)", () => {
  // `calc(var(--gap) * -1)` is a plain number: against the length of the other keyframe (`0` → implicit `0px`) it is not
  // interpolable, so the browser flips between the two at 50 % — and since the dash period is the gap, both offsets
  // draw the dot in the same place: the photons looked frozen. The gap must carry its unit.
  const css = readFileSync(join(import.meta.dirname, "../motion.css"), "utf8");
  const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{.*\\}`))?.[0] ?? "";

  it.each(["kz-flow-in", "kz-flow-out"])("%s animates a length, so the dash offset interpolates", (name) => {
    const body = keyframes(name);
    expect(body).toContain("stroke-dashoffset");
    expect(body).toMatch(/var\(--kz-flow-gap[^)]*\) \* -1px/);
  });

  it("the hub breathes in the same loop system (held off screen and while settling, still under reduced motion)", () => {
    expect(css).toMatch(/@keyframes kz-flow-breathe/);
    const { container } = render(<EngineFlow label="x" hub={{ label: "Hub", mark: <svg /> }} nodes={nodes} />);
    expect(container.querySelector(".kz-flow-hub-mark")?.getAttribute("class")).toContain("kz-loop");
  });
});
