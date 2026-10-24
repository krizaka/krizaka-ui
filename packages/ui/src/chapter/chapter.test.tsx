import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";

import { Page } from "../page";
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

describe("ChapterIndex album (#621)", () => {
  const covered = [
    { ...chapters[0], detail: "A city, a laptop, the data kept at home.", cover: { src: "/c1.webp", width: 832, height: 480 } },
    { ...chapters[1], current: false, detail: "Local models behind one address.", cover: { src: "/c2.webp", width: 1024, height: 1024 } },
    { ...chapters[2], detail: "The bills, line by line.", cover: { src: "/c3.webp", width: 1360, height: 768 } },
  ];

  it("is still an ordered list of links: one taped print per row, decorative, the title is the link's name; no axe violation", async () => {
    const { container } = render(<ChapterIndex variant="album" label="Chapters" newLabel="Nouveau" chapters={covered} />);
    const list = screen.getByRole("list", { name: "Chapters" });
    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("data-variant")).toBe("album");
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      const print = row.querySelector(".kz-chapter-print.kz-taped") as HTMLElement;
      expect(print.getAttribute("aria-hidden")).toBe("true");
      expect(print.querySelector("img")?.getAttribute("alt")).toBe("");
      expect(within(row).getAllByRole("link")).toHaveLength(1);
    }
    expect(screen.getByRole("link", { name: "What a GPU costs Nouveau" }).getAttribute("href")).toBe("/story/what-a-gpu-costs");
    expect(rows[0].querySelector(".kz-chapter-detail")?.textContent).toBe("A city, a laptop, the data kept at home.");
    expect(rows[0].querySelector(".kz-chapter-period")?.textContent).toBe("Oct 16");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps each cover's own size (no layout shift), lazy below the first two, and the prints facing each other", () => {
    const { container } = render(<ChapterIndex variant="album" chapters={covered} />);
    const imgs = [...container.querySelectorAll("img")];
    expect(imgs.map((i) => [i.getAttribute("width"), i.getAttribute("height")])).toEqual([["832", "480"], ["1024", "1024"], ["1360", "768"]]);
    expect(imgs.map((i) => i.getAttribute("loading"))).toEqual(["eager", "eager", "lazy"]);
    const tilts = [...container.querySelectorAll<HTMLElement>(".kz-chapter-print")].map((p) => parseFloat(p.style.getPropertyValue("--kz-taped-tilt")));
    expect(tilts[0]).toBeLessThan(0);
    expect(tilts[1]).toBe(-tilts[0]);
    expect(tilts[2]).toBe(tilts[0]);
  });

  it("draws no print in the compact index, even when a cover is given", () => {
    const { container } = render(<ChapterIndex chapters={covered} />);
    expect(container.querySelector(".kz-chapter-print, img")).toBeNull();
    expect(container.querySelector("ol")?.hasAttribute("data-variant")).toBe(false);
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
  it("inside a ruled Page, one margin rule only: a nested margin draws no second line (#620)", () => {
    const { container } = render(
      <Page paper="lines" margin>
        <ChapterIndex paper={false} chapters={chapters} />
      </Page>,
    );
    const margins = [...container.querySelectorAll("[data-margin]")];
    expect(margins).toHaveLength(2);
    // jsdom draws no pseudo-element: the one rule that removes the nested line is asserted on the stylesheet, which
    // draws the line on `[data-margin]::before`, and the Storybook screenshots show a single rule in both themes.
    const nested = margins.filter((m) => m.parentElement?.closest("[data-margin]"));
    expect(nested).toEqual([margins[1]]);
    expect(css).toMatch(/\[data-margin\] \[data-margin\]::before \{ content: none; \}/);
    expect(css.indexOf("[data-margin] [data-margin]::before")).toBeGreaterThan(css.indexOf("[data-margin]::before {"));
  });
  it("the album reuses TapedPhoto's print, never redraws it: no shadow, border or tilt of its own", () => {
    const album = css.slice(css.indexOf("/* The album (#621)"), css.indexOf("/* The foot:")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(album).not.toMatch(/rotate|box-shadow|border|background|transition|animation/);
    expect(album).toContain("var(--kz-chapter-line)");
  });
  it("the rows read the paper's module and the margin's ink; no border, no box, no transition", () => {
    const block = css.slice(css.indexOf("/* ChapterIndex, ChapterHead, ChapterFoot"), css.indexOf("/* Mascot life")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(block).toContain("var(--kz-paper-module");
    expect(css).toMatch(/\.kz-heading-number,\n\.kz-chapter-no,/);
    expect(block).not.toMatch(/linear-gradient|border(-bottom|-top)?:|box-shadow|background:|transition|animation/);
    expect(block).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
  });
});
