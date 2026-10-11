import { act, render, renderHook, screen } from "@testing-library/react";
import type * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { ThemeProvider, ThemeScript, ThemeToggle, useTheme } from "./index";

function mockSystem(dark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: dark,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  mockSystem(true);
});

describe("ThemeToggle", () => {
  it("cycles dark → light → system, persists and applies the mode, with no axe violation", async () => {
    localStorage.setItem("kz-theme", "dark");
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle label={(mode) => `Theme: ${mode}`} />
      </ThemeProvider>,
    );
    const button = await screen.findByRole("button", { name: "Theme: dark" });
    expect(button.dataset.mode).toBe("dark");
    expect(await axeViolations(container)).toEqual([]);

    act(() => button.click());
    expect(button.dataset.mode).toBe("light");
    expect(localStorage.getItem("kz-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);

    act(() => button.click());
    expect(button.dataset.mode).toBe("system");
    expect(document.documentElement.classList.contains("light")).toBe(false); // the system is dark

    act(() => button.click());
    expect(button.dataset.mode).toBe("dark");
  });

  it("lets the product's className win", () => {
    render(
      <ThemeProvider>
        <ThemeToggle label="Theme" className="h-8 w-8" />
      </ThemeProvider>,
    );
    const classes = screen.getByRole("button", { name: "Theme" }).className.split(" ");
    expect(classes).toContain("h-8");
    expect(classes).not.toContain("h-10");
  });
});

describe("useTheme", () => {
  it("sets a named theme as html.theme-<name>, and replaces it", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => result.current.setTheme("orochia"));
    expect(document.documentElement.classList.contains("theme-orochia")).toBe(true);
    act(() => result.current.setTheme(null));
    expect(document.documentElement.classList.contains("theme-orochia")).toBe(false);
    expect(localStorage.getItem("kz-theme-name")).toBeNull();
  });

  it("follows a light system in system mode", () => {
    mockSystem(false);
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => result.current.setMode("system"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("refuses to run outside a provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
  });
});

/** Runs the inline script ThemeScript renders, as the browser does in <head>. */
function runScript(element: React.ReactElement) {
  const html = renderToStaticMarkup(element);
  new Function(html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""))();
  return html;
}

describe("defaultMode (ThemeScript and ThemeProvider agree)", () => {
  it("is dark before any choice, even on a light system — no flash, and the provider reports the same mode", () => {
    mockSystem(false);
    runScript(<ThemeScript defaultMode="dark" />);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    render(
      <ThemeProvider defaultMode="dark">
        <ThemeToggle label={(mode) => `Theme: ${mode}`} />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button", { name: "Theme: dark" });
    expect(document.documentElement.classList.contains("light")).toBe(false);
    act(() => button.click()); // the first toggle is visible: dark → light
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("lets the visitor's choice (kz-theme) win over the default", () => {
    localStorage.setItem("kz-theme", "light");
    runScript(<ThemeScript defaultMode="dark" />);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    const { result } = renderHook(() => useTheme(), { wrapper: ({ children }) => <ThemeProvider defaultMode="dark">{children}</ThemeProvider> });
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("ignores an unknown persisted value and falls back to the default", () => {
    localStorage.setItem("kz-theme", "sepia");
    document.documentElement.classList.add("light");
    runScript(<ThemeScript defaultMode="dark" />);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("follows the system by default, as before", () => {
    mockSystem(false);
    const html = runScript(<ThemeScript />);
    expect(html).toContain('m="system"');
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("inlines only a known mode", () => {
    const html = renderToStaticMarkup(<ThemeScript defaultMode={'x";alert(1);"' as never} />);
    expect(html).toContain('m="system"');
    expect(html).not.toContain("alert");
  });

  it("applies the default without ThemeScript too", () => {
    mockSystem(false);
    render(<ThemeProvider defaultMode="light">{null}</ThemeProvider>);
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});

describe("ThemeScript", () => {
  it("applies the persisted mode and theme before the first render", () => {
    localStorage.setItem("kz-theme", "light");
    localStorage.setItem("kz-theme-name", "orazaka");
    const html = renderToStaticMarkup(<ThemeScript nonce="abc" />);
    expect(html).toContain('nonce="abc"');
    const code = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    new Function(code)();
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("theme-orazaka")).toBe(true);
  });
});
