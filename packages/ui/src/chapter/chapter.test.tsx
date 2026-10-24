import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ChapterFoot, ChapterHead, ChapterIndex } from "./index";

const chapters = [
  { number: "01", title: "Why I build Krizaka in Montréal", period: "Oct 16", href: "/story/why-montreal" },
  { number: "02", title: "An engine on a laptop", period: "Oct 16 – 17", href: "/story/an-engine-on-a-laptop", current: true },
  { number: "03", title: "What a GPU costs", period: "Oct 15 – 21", href: "/story/what-a-gpu-costs", isNew: true },
];

describe("ChapterIndex", () => {
  it("is an ordered list on the ruled paper with the margin: one row per chapter, the title is the link, no axe violation", async () => {
    const { container } = render(<ChapterIndex label="Chapters" chapters={chapters} newLabel="Nouveau" />);
    const list = screen.getByRole("list", { name: "Chapters" });
    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("data-paper")).toBe("lines");
    expect(list.hasAttribute("data-margin")).toBe(true);
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.querySelector(".kz-chapter-no")?.textContent)).toEqual(["01", "02", "03"]);
    const link = screen.getByRole("link", { name: "An engine on a laptop" });
    expect(link.getAttribute("href")).toBe("/story/an-engine-on-a-laptop");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.querySelector(".kz-chapter-title")?.textContent).toBe("An engine on a laptop");
    expect(rows[0].querySelector(".kz-chapter-period")?.textContent).toBe("Oct 16");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("marks only the latest « New », inside its link; no second line unless a detail is given", () => {
    const { container } = render(<ChapterIndex chapters={chapters} newLabel="Nouveau" />);
    expect(container.querySelectorAll(".kz-chapter-new")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "What a GPU costs Nouveau" }).closest("li")?.hasAttribute("data-new")).toBe(true);
    expect(container.querySelector(".kz-chapter-detail")).toBeNull();
    render(<ChapterIndex chapters={[{ ...chapters[0], detail: "A claim without a source → a run that keeps its id" }]} />);
    expect(screen.getByText("A claim without a source → a run that keeps its id").className).toBe("kz-chapter-detail");
  });

  it("renders internal chapters through the app's link; `paper={false}` leaves the page's own ruling", () => {
    const Link = ({ href, children, className }: { href: string; children?: React.ReactNode; className?: string }) => (
      <a data-router="" href={href} className={className}>
        {children}
      </a>
    );
    render(<ChapterIndex paper={false} linkAs={Link} chapters={[chapters[0]]} />);
    expect(screen.getByRole("link", { name: chapters[0].title }).hasAttribute("data-router")).toBe(true);
    expect(screen.getByRole("list").hasAttribute("data-paper")).toBe(false);
  });
});

describe("ChapterHead", () => {
  it("hangs the number in the margin, then the h1, one meta line and the standfirst once; the arrow is not read", async () => {
    const { container } = render(
      <ChapterHead
        number="07"
        title="An empty result is not a success"
        period="Oct 16 – 23, 2026"
        readingTime="9 min read"
        faced="A green screen with an empty ranking"
        built="a run never delivers nothing as a success"
        versusLabels={["What I faced", "What we built"]}
      />,
    );
    const head = container.querySelector("header")!;
    expect(head.hasAttribute("data-margin")).toBe(true);
    expect(head.querySelector(".kz-chapter-no")?.textContent).toBe("07");
    expect(screen.getByRole("heading", { level: 1, name: "An empty result is not a success" })).toBeTruthy();
    expect(head.querySelector(".kz-chapter-meta")?.textContent).toBe("Oct 16 – 23, 2026 · 9 min read");
    const standfirst = head.querySelector(".kz-chapter-standfirst")!;
    expect(head.querySelectorAll(".kz-chapter-standfirst")).toHaveLength(1);
    expect(standfirst.querySelector(".kz-chapter-arrow")?.getAttribute("aria-hidden")).toBe("true");
    expect([...standfirst.querySelectorAll(".kz-sr-only")].map((s) => s.textContent)).toEqual(["What I faced, ", "; What we built, "]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("leaves out what it is not given: no meta line, no standfirst without both halves; an h2 on demand", () => {
    const { container } = render(<ChapterHead number="01" title="Why Montréal" faced="A claim" level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Why Montréal" })).toBeTruthy();
    expect(container.querySelector(".kz-chapter-meta")).toBeNull();
    expect(container.querySelector(".kz-chapter-standfirst")).toBeNull();
  });
});

describe("ChapterFoot", () => {
  it("is a named navigation: previous and next on the lines (rel prev / next), then the line back to the story", async () => {
    const { container } = render(
      <ChapterFoot
        label="Chapitres"
        labels={{ previous: "précédent", next: "suivant" }}
        previous={{ number: "06", title: "The first products", href: "/story/the-first-products" }}
        next={{ number: "08", title: "Building with agents", href: "/story/building-with-agents" }}
        back={{ href: "/", label: "Retour à l'histoire" }}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Chapitres" });
    expect(nav.getAttribute("data-paper")).toBe("lines");
    expect(screen.getByRole("link", { name: "The first products" }).getAttribute("rel")).toBe("prev");
    expect(screen.getByRole("link", { name: "Building with agents" }).getAttribute("rel")).toBe("next");
    expect(screen.getByRole("link", { name: /Retour à l'histoire/ }).getAttribute("href")).toBe("/");
    expect(within(nav).getAllByRole("listitem").map((li) => li.querySelector(".kz-chapter-period")?.textContent)).toEqual(["← précédent", "suivant →"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("on the latest chapter shows only the previous one", () => {
    render(<ChapterFoot previous={{ title: "Chapter 7", href: "/7" }} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: /Next/ })).toBeNull();
  });
});

describe("the Cahier's paper, reused, never copied", () => {
  const css = readFileSync(join(import.meta.dirname, "..", "blocks.css"), "utf8");
  it("the rows read the paper's module and the margin's ink; no border, no box, no transition", () => {
    const block = css.slice(css.indexOf("/* ChapterIndex, ChapterHead, ChapterFoot"), css.indexOf("/* Mascot life")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(block).toContain("var(--kz-paper-module");
    expect(css).toMatch(/\.kz-heading-number,\n\.kz-chapter-no,/);
    expect(block).not.toMatch(/linear-gradient|border(-bottom|-top)?:|box-shadow|background:|transition|animation/);
    expect(block).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
  });
});
