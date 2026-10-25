import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { normalizeMatrix, type NotificationMatrix, NotificationPreferences, presetInForce } from "./index";

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
    expect(onValueChange).toHaveBeenCalledWith({ a: { app: true, email: false }, sec: { app: true, email: true } });
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
    expect(onValueChange).toHaveBeenCalledWith({ ...off, sec: { app: true, email: true } });
    rerender(<NotificationPreferences label="s" presetsLabel="Presets" customHint="Custom" channels={channels} categories={categories} presets={presets} value={{ a: { app: true, email: false } }} onValueChange={onValueChange} />);
    expect(screen.getByText("Custom")).toBeTruthy();
  });

  it("never emits what the controls cannot show: locked rows stay on, an inert channel keeps its value (#523 review)", () => {
    const inert = [channels[0]!, { ...channels[1]!, disabled: true }];
    const quiet = { id: "quiet", label: "Quiet", hint: "Quiet.", value: { a: { app: false, email: false }, sec: { app: false, email: false } } };
    const onValueChange = vi.fn();
    render(<NotificationPreferences label="s" presetsLabel="Presets" channels={inert} categories={categories} presets={[...presets, quiet]} value={on} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Quiet" }));
    expect(onValueChange).toHaveBeenLastCalledWith({ a: { app: false, email: true }, sec: { app: true, email: true } });
    expect(normalizeMatrix({ sec: { app: false } }, {}, categories, channels).sec).toEqual({ app: true, email: true });
  });

  it("draws no switch where a category does not use a channel, and never writes that crossing", () => {
    const social = [{ id: "social", label: "Social", channels: ["app"] }];
    const onValueChange = vi.fn();
    render(<NotificationPreferences label="s" channels={channels} categories={social} value={{ social: { app: true } }} onValueChange={onValueChange} />);
    expect(screen.queryByRole("switch", { name: "Social — E-mail" })).toBeNull();
    fireEvent.click(screen.getByRole("switch", { name: "Social — App" }));
    expect(onValueChange).toHaveBeenCalledWith({ social: { app: false } });
  });

  it("finds the preset in force whatever the inert channels say", () => {
    const inert = [channels[0]!, { ...channels[1]!, disabled: true }];
    expect(presetInForce({ a: { app: true, email: false } }, presets, categories, inert)).toBe("all");
  });
});
