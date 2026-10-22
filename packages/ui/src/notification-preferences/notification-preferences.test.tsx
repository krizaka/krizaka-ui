import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { type NotificationMatrix, NotificationPreferences, presetInForce } from "./index";

const channels = [{ id: "app", label: "App" }, { id: "email", label: "E-mail" }];
const categories = [{ id: "a", label: "Alpha" }, { id: "sec", label: "Security", locked: true, lockedNote: "Always on" }];
const on: NotificationMatrix = { a: { app: true, email: true } };
const off: NotificationMatrix = { a: { app: false, email: false } };
const presets = [{ id: "all", label: "All", hint: "Everything.", value: on }, { id: "none", label: "None", hint: "Nothing.", value: off }];

describe("NotificationPreferences", () => {
  it("is a table named by its channels and categories, each switch named by both, with no axe violation", async () => {
    const { container } = render(<NotificationPreferences label="Settings" channels={channels} categories={categories} value={on} onValueChange={() => undefined} />);
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toContain("E-mail");
    expect(screen.getByRole("switch", { name: "Alpha — App" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("changes one crossing and keeps the others", () => {
    const onValueChange = vi.fn();
    render(<NotificationPreferences label="s" channels={channels} categories={categories} value={on} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Alpha — E-mail" }));
    expect(onValueChange).toHaveBeenCalledWith({ a: { app: true, email: false } });
  });

  it("shows the locked row on and inert, with its note, and an inert channel", () => {
    render(<NotificationPreferences label="s" channels={[channels[0]!, { ...channels[1]!, disabled: true }]} categories={categories} value={on} onValueChange={() => undefined} />);
    const locked = screen.getByRole("switch", { name: "Security — App" });
    expect(locked.getAttribute("aria-checked")).toBe("true");
    expect((locked as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Always on")).toBeTruthy();
    expect((screen.getByRole("switch", { name: "Alpha — E-mail" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("says which preset is in force, applies one, and says custom otherwise", () => {
    expect(presetInForce(on, presets, categories, channels)).toBe("all");
    expect(presetInForce({ a: { app: true, email: false } }, presets, categories, channels)).toBeNull();
    const onValueChange = vi.fn();
    const { rerender } = render(<NotificationPreferences label="s" presetsLabel="Presets" customHint="Custom" channels={channels} categories={categories} presets={presets} value={on} onValueChange={onValueChange} />);
    expect(screen.getByText("Everything.")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "None" }));
    expect(onValueChange).toHaveBeenCalledWith(off);
    rerender(<NotificationPreferences label="s" presetsLabel="Presets" customHint="Custom" channels={channels} categories={categories} presets={presets} value={{ a: { app: true, email: false } }} onValueChange={onValueChange} />);
    expect(screen.getByText("Custom")).toBeTruthy();
  });
});
