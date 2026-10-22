import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PAGE_TRANSITION_CLASS, PageTransition } from "./PageTransition";

const css = readFileSync(join(import.meta.dirname, "..", "motion.css"), "utf8");
const section = css.slice(css.indexOf("PAGE TRANSITIONS")).replace(/\/\*[\s\S]*?\*\//g, "");

afterEach(() => vi.doUnmock("react"));

describe("PageTransition: the component", () => {
  it("renders its children when the runtime has no ViewTransition (plain React)", () => {
    render(
      <PageTransition>
        <p>page</p>
      </PageTransition>,
    );
    expect(screen.getByText("page")).toBeTruthy();
  });

  it.each(["ViewTransition", "unstable_ViewTransition"])("wraps the children in React's %s with the page class when it exists", async (key) => {
    vi.resetModules();
    const seen: Record<string, unknown>[] = [];
    vi.doMock("react", async (original) => ({
      ...(await original<typeof import("react")>()),
      ViewTransition: undefined,
      unstable_ViewTransition: undefined,
      [key]: ({ children, ...props }: { children: ReactNode }) => {
        seen.push(props);
        return <div data-testid="vt">{children}</div>;
      },
    }));
    const { PageTransition: Wrapped, PAGE_TRANSITION_CLASS: cls } = await import("./PageTransition");
    render(
      <Wrapped>
        <p>page</p>
      </Wrapped>,
    );
    expect(screen.getByTestId("vt").textContent).toBe("page");
    expect(seen).toEqual([{ default: cls }]);
  });
});

describe("PageTransition: the stylesheet section", () => {
  it("has its own section and styles the old and the new page with the page class", () => {
    expect(css).toContain("PAGE TRANSITIONS");
    expect(section).toContain(`::view-transition-old(.${PAGE_TRANSITION_CLASS})`);
    expect(section).toContain(`::view-transition-new(.${PAGE_TRANSITION_CLASS})`);
  });

  it("takes every duration and easing from the --kz-motion-* tokens, none typed here", () => {
    const rules = section.slice(0, section.indexOf("@media"));
    expect(rules).toMatch(/var\(--kz-motion-duration-fast\)/);
    expect(rules).toMatch(/var\(--kz-motion-duration-base\)/);
    expect(rules).not.toMatch(/\d(ms|s)\b/);
  });

  it("is instant under prefers-reduced-motion: no animation on any view-transition pseudo-element", () => {
    const reduced = section.slice(section.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/::view-transition-group\(\*\)/);
    expect(reduced).toMatch(/::view-transition-old\(\*\)/);
    expect(reduced).toMatch(/::view-transition-new\(\*\)/);
    expect(reduced).toMatch(/animation:\s*none\s*!important/);
  });
});
