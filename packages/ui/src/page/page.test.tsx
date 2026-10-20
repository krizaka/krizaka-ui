import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Facts, Page, Section, SectionHeading, Ticks } from "./index";

describe("Page", () => {
  it("lays the content on the notebook's ruling (Cahier, ADR-004): Seyès squares, lines only, and the red margin", () => {
    const { container } = render(
      <>
        <Page paper="ruled" margin>a</Page>
        <Page paper="lines">b</Page>
        <Page>c</Page>
      </>,
    );
    const [ruled, lines, plain] = [...container.children] as HTMLElement[];
    expect(ruled.dataset.paper).toBe("ruled");
    expect(ruled.hasAttribute("data-margin")).toBe(true);
    expect(lines.dataset.paper).toBe("lines");
    expect(plain.dataset.paper).toBeUndefined();
    expect(plain.hasAttribute("data-margin")).toBe(false);
  });

  it("numbers a section in the margin, as a notebook does (§ 2), instead of an uppercase overline", () => {
    render(<Section id="products" number="§ 2" title="Products" paper="lines" margin>x</Section>);
    const number = screen.getByText("§ 2");
    expect(number.className).toContain("kz-heading-number");
    expect(number.closest(".kz-heading")).toBeTruthy();
    const section = screen.getByRole("region", { name: "Products" });
    expect(section.dataset.paper).toBe("lines");
    expect(section.hasAttribute("data-margin")).toBe(true);
  });

  it("frames its content, sized by data-size", () => {
    const { container } = render(<Page size="narrow" as="main">x</Page>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("MAIN");
    expect(el.className).toContain("kz-frame");
    expect(el.dataset.size).toBe("narrow");
  });

  it("renders a section named by its heading, with a divider, and no axe violation", async () => {
    const { container } = render(
      <Section id="why" eyebrow="Why" title="Nothing leaves" lead="Local by default." divider>
        <p>Body</p>
      </Section>,
    );
    const section = screen.getByRole("region", { name: "Nothing leaves" });
    expect(section.hasAttribute("data-divider")).toBe(true);
    expect(section.querySelector(".kz-frame")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Nothing leaves" }).id).toBe("why");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("puts the section on the brand's backdrop", () => {
    const { container } = render(<Section backdrop={{ direction: "up" }}>x</Section>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("kz-backdrop");
    expect(el.className).toContain("kz-section");
    expect(el.dataset.direction).toBe("up");
  });

  it("renders a heading with its actions, as an h3 and revealed", () => {
    render(<SectionHeading title="Later" level={3} reveal actions={<a href="#all">All</a>} />);
    const heading = screen.getByRole("heading", { level: 3, name: "Later" });
    expect(heading.parentElement?.hasAttribute("data-reveal")).toBe(true);
    expect(screen.getByRole("link", { name: "All" })).toBeTruthy();
  });

  it("reads backticks as code and lists facts", async () => {
    const { container } = render(
      <div>
        <p>
          <Ticks>{"A `requestId` everywhere"}</Ticks>
        </p>
        <Facts aria-label="Status" items={[{ label: "npm 2.5", tone: "ok", href: "https://npmjs.com" }, { label: "wip", tone: "wip" }]} />
      </div>,
    );
    expect(container.querySelector("code")?.textContent).toBe("requestId");
    expect(screen.getByRole("link", { name: /npm 2.5/ }).getAttribute("target")).toBe("_blank");
    expect(container.querySelector('[data-tone="wip"]')).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
