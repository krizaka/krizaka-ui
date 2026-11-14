import { render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { type ArchEdge, ArchitectureDiagram, type ArchNode, type ArchView, safeHref } from "./index";

const node = (over: Partial<ArchNode> & Pick<ArchNode, "id" | "title">): ArchNode => ({
  parent: null,
  kind: "container",
  shape: "rectangle",
  technology: null,
  description: null,
  compound: false,
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  ...over,
});

const edge = (over: Partial<ArchEdge> & Pick<ArchEdge, "id" | "source" | "target">): ArchEdge => ({
  label: null,
  points: [
    [0, 0],
    [10, 10],
    [20, 20],
    [30, 30],
  ],
  labelBBox: { x: 10, y: 10, width: 60, height: 18 },
  step: null,
  back: false,
  ...over,
});

const staticView: ArchView = {
  id: "ctx",
  title: "The shop · containers",
  dynamic: false,
  bounds: { x: 0, y: 0, width: 600, height: 400 },
  nodes: [
    node({ id: "shop", title: "Shop", compound: true, kind: "system", width: 600, height: 250 }),
    node({ id: "shop.web", parent: "shop", title: "Storefront", shape: "browser", technology: "Next.js", description: "The pages a customer sees." }),
    node({ id: "shop.jobs", parent: "shop", title: "Jobs", shape: "queue", x: 300 }),
    node({ id: "db", title: "Database", shape: "storage", kind: "external", y: 300 }),
  ],
  edges: [
    edge({ id: "e1", source: "shop.web", target: "shop.jobs", label: "enqueues" }),
    edge({ id: "e2", source: "shop.web", target: "db", label: "reads and writes" }),
  ],
};

const dynamicView: ArchView = {
  id: "flow",
  title: "A pull request's life",
  dynamic: true,
  bounds: { x: 0, y: 0, width: 600, height: 400 },
  nodes: [node({ id: "a", title: "Agent", shape: "person" }), node({ id: "ci", title: "CI" }), node({ id: "t", title: "Train" })],
  /* Given out of order: the text version follows the step numbers, not the array. */
  edges: [
    edge({ id: "s2", source: "ci", target: "t", label: "reports green", step: 2 }),
    edge({ id: "s1", source: "a", target: "ci", label: "opens the pull request", step: 1 }),
    edge({ id: "s3", source: "t", target: "a", label: null, labelBBox: null, step: 3, back: true }),
  ],
};

describe("ArchitectureDiagram", () => {
  it("draws the view as one named image on the plate, with its title and no axe violation", async () => {
    const { container } = render(<ArchitectureDiagram view={staticView} subtitle="C4 · level 2" />);
    const img = screen.getByRole("img", { name: "The shop · containers" });
    expect(img.tagName.toLowerCase()).toBe("svg");
    /* Named by aria-label, never by an SVG <title>: a page has one <title> (the sites' SEO check counts them). */
    expect(img.querySelector("title")).toBeNull();
    expect(container.querySelector("figure.kz-plate figcaption .kz-plate-title")?.textContent).toBe("The shop · containers");
    expect(screen.getByText("C4 · level 2")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws each element by its shape, a group as a frame, an unknown shape as a box, an external element apart", () => {
    const view: ArchView = { ...staticView, nodes: [...staticView.nodes, node({ id: "odd", title: "Odd", shape: "hexagon-of-doom" })] };
    const { container } = render(<ArchitectureDiagram view={view} />);
    const shapes = [...container.querySelectorAll<SVGGElement>(".kz-arch-element")].map((g) => g.dataset.shape);
    expect(shapes).toEqual(["browser", "queue", "storage", "box"]);
    expect(container.querySelectorAll(".kz-arch-group")).toHaveLength(1);
    expect(container.querySelector(".kz-arch-group-title")?.textContent).toBe("Shop");
    expect(container.querySelector('.kz-arch-element[data-outside="true"]')?.textContent).toContain("Database");
  });

  it("draws each edge's line, arrowhead and label; a long title wraps to several lines", () => {
    const long = node({ id: "long", title: "A rather long container name that cannot fit on one line", width: 160 });
    const { container } = render(<ArchitectureDiagram view={{ ...staticView, nodes: [long] }} />);
    expect(container.querySelectorAll(".kz-arch-line")).toHaveLength(2);
    expect(container.querySelectorAll(".kz-arch-arrow")).toHaveLength(2);
    expect(container.querySelector(".kz-arch-line")?.getAttribute("d")).toBe("M0,0 C10,10 20,20 30,30");
    expect([...container.querySelectorAll(".kz-arch-label-text")].map((t) => t.textContent)).toEqual(["enqueues", "reads", "and", "writes"]);
    expect(container.querySelectorAll(".kz-arch-title").length).toBeGreaterThan(1);
  });

  it("points a back edge's arrowhead at its first point", () => {
    const { container } = render(<ArchitectureDiagram view={dynamicView} />);
    const arrows = [...container.querySelectorAll(".kz-arch-arrow")].map((p) => p.getAttribute("points")?.split(" ")[0]);
    expect(arrows).toEqual(["30,30", "30,30", "0,0"]);
  });

  it("shows a dynamic view's flow: a numbered badge per step, and the steps in order in the text version", () => {
    const { container } = render(<ArchitectureDiagram view={dynamicView} />);
    expect([...container.querySelectorAll<SVGGElement>(".kz-arch-step")].map((g) => g.textContent)).toEqual(["2", "1", "3"]);
    const steps = container.querySelector("details ol")!;
    expect([...steps.querySelectorAll("li")].map((li) => [li.value, li.textContent])).toEqual([
      [1, "Agent → CI: opens the pull request"],
      [2, "CI → Train: reports green"],
      [3, "Train → Agent"],
    ]);
    expect(within(container.querySelector("details")!).getByText("Steps")).toBeTruthy();
  });

  it("a static view has no step badge and lists its relations", () => {
    const { container } = render(<ArchitectureDiagram view={{ ...staticView, edges: staticView.edges.map((e, i) => ({ ...e, step: i + 1 })) }} />);
    expect(container.querySelector(".kz-arch-step")).toBeNull();
    expect([...container.querySelectorAll("details > ul:last-of-type > li")].map((li) => li.textContent)).toEqual([
      "Storefront → Jobs: enqueues",
      "Storefront → Database: reads and writes",
    ]);
  });

  it("writes the full text version from the same view: elements nested in their group, technology and description", () => {
    render(<ArchitectureDiagram view={staticView} textOpen words={{ summary: "Le schéma en mots", elements: "Éléments", relations: "Relations" }} />);
    const details = screen.getByText("Le schéma en mots").closest("details")!;
    expect(details.open).toBe(true);
    const group = within(details).getByText("Shop").closest("li")!;
    expect(within(group).getByText("Storefront").closest("li")?.textContent).toBe("Storefront (Next.js): The pages a customer sees.");
    expect(within(details).getByText("Database").closest("li")?.parentElement?.parentElement).toBe(details);
  });

  it("renders a hostile label as text, never as markup", () => {
    const hostile = '<img src=x onerror=alert(1)>';
    const view: ArchView = {
      ...staticView,
      title: hostile,
      nodes: [node({ id: "x", title: hostile, technology: '<script>alert(2)</script>', description: '"><svg onload=alert(3)>' })],
      edges: [edge({ id: "y", source: "x", target: "x", label: '<a href="javascript:alert(4)">go</a>' })],
    };
    const { container } = render(<ArchitectureDiagram view={view} textOpen />);
    expect(container.querySelector("img, script, a, foreignObject")).toBeNull();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelectorAll("[onerror], [onload]")).toHaveLength(0);
    expect(screen.getByRole("img", { name: hostile })).toBeTruthy();
    expect(container.querySelector(".kz-arch-title")?.textContent).toContain("<img");
    expect(container.textContent).toContain("<script>alert(2)</script>");
  });

  it("links an element only through the links prop, and only to a safe address", () => {
    const { container } = render(
      <ArchitectureDiagram
        view={staticView}
        textOpen
        links={{ "shop.web": "https://shop.example/", "shop.jobs": "javascript:alert(1)", db: "/docs/db?x=1#top" }}
      />,
    );
    const links = [...container.querySelectorAll("details a")].map((a) => [a.textContent, a.getAttribute("href")]);
    expect(links).toEqual([
      ["Storefront", "https://shop.example/"],
      ["Database", "/docs/db?x=1#top"],
    ]);
    expect(container.querySelector("svg a")).toBeNull();
  });

  it("never reads a link from the links object's prototype", () => {
    const view: ArchView = { ...staticView, nodes: [node({ id: "constructor", title: "Constructor" }), node({ id: "toString", title: "ToString" })], edges: [] };
    const { container } = render(<ArchitectureDiagram view={view} links={{}} textOpen />);
    expect(container.querySelector("a")).toBeNull();
  });
});

describe("safeHref", () => {
  it("keeps http(s) addresses and same-site paths, parsed", () => {
    expect(safeHref("https://ui.krizaka.com/components")).toBe("https://ui.krizaka.com/components");
    expect(safeHref("http://example.com")).toBe("http://example.com/");
    expect(safeHref("/docs/a?b=1#c")).toBe("/docs/a?b=1#c");
    expect(safeHref("#steps")).toBe("#steps");
  });

  it("refuses every other scheme and a protocol-relative host", () => {
    for (const href of ["javascript:alert(1)", " JavaScript:alert(1)", "java\tscript:alert(1)", "data:text/html,<script>", "vbscript:x", "mailto:a@b.c"]) {
      expect(safeHref(href)).toBeUndefined();
    }
    expect(safeHref("//evil.example/x")).toBe("https://evil.example/x");
    expect(safeHref("/\\evil.example")).toBe("https://evil.example/");
  });
});
