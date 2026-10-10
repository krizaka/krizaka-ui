import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";

import { GLYPHS, outputs } from "../scripts/glyphs.mjs";
import * as catalog from "../src/catalog";
import * as icons from "../src/index";

const names = Object.keys(GLYPHS);
const component = (name: string) => `${name[0].toUpperCase()}${name.slice(1)}Icon`;
const allNumbers = (d: string) => [...d.matchAll(/-?\d*\.?\d+/g)].map(([n]) => Number(n));

describe("the set", () => {
  it("covers the product vocabulary and the usual navigation (40–80 icons)", () => {
    expect(names.length).toBeGreaterThanOrEqual(40);
    expect(names.length).toBeLessThanOrEqual(80);
    for (const word of ["tip", "unlock", "paid", "auction", "challenge", "goal", "creator", "story", "story24h", "payout", "wallet", "share90", "lock", "follow", "message", "upload", "video", "chat", "ai", "agent", "studio", "pack", "automation", "knowledge", "shield", "local", "server", "billing", "credits", "theme", "search", "settings", "notification"]) {
      expect(names, word).toContain(word);
    }
  });

  it("exports one component per glyph, named <Name>Icon", () => {
    for (const name of names) expect(icons[component(name) as keyof typeof icons], name).toBeDefined();
    expect(Object.keys(catalog.glyphIndex)).toEqual(names);
  });

  it("keeps the generated sources in sync with scripts/glyphs.mjs", () => {
    for (const [path, content] of Object.entries(outputs() as Record<string, string>)) {
      expect(readFileSync(join(import.meta.dirname, "..", path), "utf8"), path).toBe(content);
    }
  });
});

describe("the grammar", () => {
  it.each(names)("%s stays on the 24 grid, inside the 1..23 safe area", (name) => {
    const g = GLYPHS[name as keyof typeof GLYPHS] as { p?: string[]; c?: number[][]; n?: number[][] };
    for (const d of g.p ?? []) {
      // Absolute coordinates only appear after M/L/H/V; arcs and relative commands are bounded by the render test below.
      for (const n of allNumbers(d.replace(/[a-z][^A-Z]*/g, ""))) {
        expect(n, d).toBeGreaterThanOrEqual(0);
        expect(n, d).toBeLessThanOrEqual(24);
      }
    }
    for (const [cx, cy, r] of g.c ?? []) {
      expect(cx - r).toBeGreaterThanOrEqual(1);
      expect(cx + r).toBeLessThanOrEqual(23);
      expect(cy - r).toBeGreaterThanOrEqual(1);
      expect(cy + r).toBeLessThanOrEqual(23);
    }
    for (const v of (g.n ?? []).flat()) {
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(22);
    }
  });

  it("gives every product icon its node, and keeps the utility glyphs bare", () => {
    for (const [name, g] of Object.entries(GLYPHS) as [string, { group: string; n?: number[][] }][]) {
      if (g.group === "product") expect(g.n?.length ?? 0, name).toBeGreaterThanOrEqual(1);
    }
    for (const name of ["close", "back", "forward", "chevronDown", "chevronRight", "plus", "check", "menu"]) {
      expect((GLYPHS as Record<string, { n?: unknown[] }>)[name].n, name).toBeUndefined();
    }
  });
});

describe("<Icon>", () => {
  it("is decorative by default: aria-hidden, currentColor, 24 px, stroke 1.75", () => {
    const { container } = render(<icons.ChatIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-width")).toBe("1.75");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("data-kz-icon")).toBe("ChatIcon");
  });

  it("becomes a named image with title", () => {
    const { container } = render(<icons.LockIcon title="Private" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("Private");
    expect(svg.querySelector("title")?.textContent).toBe("Private");
    expect(svg.hasAttribute("aria-hidden")).toBe(false);
  });

  it("takes size, strokeWidth, nodeColor, className and a ref", () => {
    const ref = { current: null as SVGSVGElement | null };
    const { container } = render(<icons.WalletIcon ref={ref} size={32} strokeWidth={1.5} nodeColor="var(--kz-accent)" className="text-fg" />);
    const svg = container.querySelector("svg")!;
    expect(ref.current).toBe(svg);
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("stroke-width")).toBe("1.5");
    expect(svg.getAttribute("class")).toBe("text-fg");
    expect(svg.querySelector("[data-node]")?.getAttribute("fill")).toBe("var(--kz-accent)");
  });

  it.each(names)("%s renders its glyph", (name) => {
    const Icon = icons[component(name) as keyof typeof icons] as typeof icons.ChatIcon;
    const { container } = render(<Icon />);
    const g = GLYPHS[name as keyof typeof GLYPHS] as { p?: string[]; c?: unknown[]; n?: unknown[] };
    expect(container.querySelectorAll("path")).toHaveLength(g.p?.length ?? 0);
    expect(container.querySelectorAll("circle")).toHaveLength((g.c?.length ?? 0) + (g.n?.length ?? 0));
  });

  it("builds a custom icon with createIcon", () => {
    const Custom = icons.createIcon("CustomIcon", { p: ["M4 4h16"], n: [[12, 12]] });
    const { container } = render(<Custom />);
    expect(Custom.displayName).toBe("CustomIcon");
    expect(container.querySelector("[data-node]")?.getAttribute("r")).toBe(String(icons.NODE_RADIUS));
  });
});
