import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { useAppearance } from "../theme";
import { ThemeProvider } from "../theme";
import { AppearanceSettings, type ThemeCardOption } from "./index";

const p = { surface0: "#111318", surface1: "#171a21", surface2: "#1e222b", text: "#e8ebf1", muted: "#959eae" };
const THEMES: ThemeCardOption[] = [
  { id: "system", label: "System", preview: null, halves: [p, p] },
  { id: "light", label: "Light", preview: p },
  { id: "dark", label: "Dark", preview: p },
];

describe("AppearanceSettings (#657)", () => {
  it("theme cards are one radio group with ONE selected mark; the arrows choose", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    const { container } = render(<AppearanceSettings themes={THEMES} theme="light" onThemeChange={onThemeChange} />);
    const group = screen.getByRole("radiogroup", { name: "Theme" });
    expect(within(group).getAllByRole("radio").filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(1);
    expect(group.querySelectorAll('[data-state="checked"] svg')).toHaveLength(1);
    within(group).getByRole("radio", { name: /Light/ }).focus();
    await user.keyboard("{ArrowRight>}");
    await user.keyboard("{/ArrowRight}");
    expect(onThemeChange).toHaveBeenLastCalledWith("dark");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows only the rows it is given; the sound is opt-in", async () => {
    const user = userEvent.setup();
    const onSoundChange = vi.fn();
    const { rerender } = render(<AppearanceSettings themes={THEMES} theme="dark" onThemeChange={() => {}} />);
    expect(screen.queryByRole("switch")).toBeNull();
    expect(screen.queryByText("Density")).toBeNull();
    rerender(<AppearanceSettings themes={THEMES} theme="dark" onThemeChange={() => {}} sound={false} onSoundChange={onSoundChange} densities={[{ value: "standard", label: "Standard" }, { value: "compact", label: "Compact" }]} density="standard" onDensityChange={() => {}} />);
    expect(screen.getByRole("switch", { name: "Sound" }).getAttribute("aria-checked")).toBe("false");
    await user.click(screen.getByRole("switch", { name: "Sound" }));
    expect(onSoundChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("radiogroup", { name: "Density" })).toBeTruthy();
  });
});

function Probe() {
  const a = useAppearance();
  return (
    <>
      <button type="button" onClick={() => a.setThemeId("blueprint")}>blueprint</button>
      <button type="button" onClick={() => a.setDensity("compact")}>compact</button>
      <button type="button" onClick={() => a.setAccent("akinaza")}>accent</button>
      <output>{`${a.themeId}|${a.density}|${a.accent}`}</output>
    </>
  );
}

describe("useAppearance (#657)", () => {
  it("applies the choices at once on <html>: the surface set is dark, density and accent are attributes, and they are kept", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await user.click(screen.getByText("blueprint"));
    await user.click(screen.getByText("compact"));
    await user.click(screen.getByText("accent"));
    const html = document.documentElement;
    expect(html.classList.contains("theme-blueprint")).toBe(true);
    expect(html.classList.contains("light")).toBe(false);
    expect(html.getAttribute("data-density")).toBe("compact");
    expect(html.getAttribute("data-accent")).toBe("akinaza");
    expect(screen.getByRole("status", { hidden: true }).textContent).toBe("blueprint|compact|akinaza");
    expect(localStorage.getItem("kz-density")).toBe("compact");
    expect(localStorage.getItem("kz-accent")).toBe("akinaza");
  });
});
