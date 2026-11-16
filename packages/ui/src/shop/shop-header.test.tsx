// Ticket krizaka-internal#3747 — the header and the services of a shop page at 360 px: the whole name, no typewriter face,
// one link per row; the veil reads in both themes (the scrim is the same black in both).
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import { CoverHero, coverHero } from "../cover-hero";
import { HeroFacts, HeroSection } from "./hero";
import { ServicesSection } from "./services";

const service = { id: "a", name: "Coupe longue durée avec soin et coiffage complet", price: "$45", duration: "30 min", description: "Une description assez longue pour passer à la ligne.", href: "/book?s=a", popular: true };

describe("services · menu at 360 px", () => {
  it("never truncates and never sets a typewriter face", () => {
    const { container } = render(<ServicesSection title="Services" services={[{ ...service, category: "cuts" }]} chooseLabel="Choose" popularLabel="Popular" />);
    expect(container.innerHTML).not.toContain("truncate");
    expect(container.innerHTML).not.toContain("font-mono");
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(service.name);
  });

  it("gives one link per row, which covers the row", () => {
    const { container } = render(<ServicesSection title="Services" services={[service, { ...service, id: "b" }]} chooseLabel="Choose" popularLabel="Popular" />);
    for (const row of container.querySelectorAll("li")) expect(row.querySelectorAll("a")).toHaveLength(1);
    expect(container.querySelector("li a")!.className).toContain("after:absolute");
  });
});

describe("hero", () => {
  it("has no typewriter face and wears the shop's mark and its facts", () => {
    const { container } = render(
      <HeroSection variant="split" title="Salon" eyebrow="Saint-Henri" mark={<span data-testid="mark">S</span>} facts={<HeroFacts items={["Open now", "4.9 · 120 reviews"]} label="At a glance" />} />,
    );
    expect(container.innerHTML).not.toContain("font-mono");
    expect(screen.getByTestId("mark")).toBeTruthy();
    expect(screen.getByRole("list", { name: "At a glance" }).querySelectorAll("li")).toHaveLength(2);
  });

  it("draws the poster's mark and no typewriter eyebrow", () => {
    const { container } = render(<CoverHero title="Salon" eyebrow="Saint-Henri" mark={<span data-testid="mark">S</span>} />);
    expect(screen.getByTestId("mark")).toBeTruthy();
    expect(container.innerHTML).not.toContain("font-mono");
  });
});

describe("cover-hero · plain and veil", () => {
  it("is a flat colour without a cover, no gradient", () => {
    expect(coverHero().plain()).not.toContain("gradient");
  });

  it("keeps the veil's text at 4.5:1 or more over the brightest photo, in both themes", () => {
    const tokens = JSON.parse(readFileSync(join(process.cwd(), "../tokens/src/tokens/color.tokens.json"), "utf8"));
    const alphaOf = (v: string) => Number(/\/\s*([\d.]+)\)/.exec(v)![1]);
    const strong = alphaOf(tokens.scrim.strong.$value);
    expect(tokens.text["on-media"].$value).toBe("hsl(0 0% 100%)");
    expect(tokens.scrim.strong.$value).toMatch(/^hsl\(0 0% 0%/);
    const veil = coverHero().veil();
    expect(veil).toContain("from-scrim-strong");
    // `via-scrim-strong/75` is the token mixed at 75 %: its alpha is multiplied.
    const mid = (Number(/via-scrim-strong\/(\d+)/.exec(veil)![1]) / 100) * strong;
    const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    // White text over a white photo darkened by a black veil of the given alpha: the worst case.
    const ratio = (a: number) => 1.05 / (linear(1 - a) + 0.05);
    expect(ratio(strong)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(mid)).toBeGreaterThanOrEqual(4.5);
  });
});
