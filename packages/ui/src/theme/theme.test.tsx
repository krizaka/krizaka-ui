import { act, render, renderHook, screen } from "@testing-library/react";
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
