import { act, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ariaKeyShortcuts, formatShortcut, matchesCombo, parseCombo, useApple, useShortcuts } from "./shortcuts";

const key = (init: Partial<KeyboardEventInit> & { key: string }, target: EventTarget = document.body) => {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};

describe("parseCombo / matchesCombo", () => {
  it("reads modifiers and a key, with the usual aliases", () => {
    expect(parseCombo("mod+shift+K")).toEqual({ key: "k", mod: true, ctrl: false, alt: false, shift: true, meta: false });
    expect(parseCombo("esc").key).toBe("escape");
    expect(parseCombo("alt+up").key).toBe("arrowup");
    expect(parseCombo("mod+plus").key).toBe("+");
  });

  it("takes mod for ⌘ on Apple and Ctrl elsewhere, and wants the modifiers exactly", () => {
    const base = { key: "k", metaKey: false, ctrlKey: false, altKey: false, shiftKey: false };
    expect(matchesCombo({ ...base, metaKey: true }, "mod+k", true)).toBe(true);
    expect(matchesCombo({ ...base, ctrlKey: true }, "mod+k", true)).toBe(false);
    expect(matchesCombo({ ...base, ctrlKey: true }, "mod+k", false)).toBe(true);
    expect(matchesCombo({ ...base, ctrlKey: true, altKey: true }, "mod+k", false)).toBe(false);
    expect(matchesCombo({ ...base, key: "K", ctrlKey: true }, "ctrl+k", false)).toBe(true);
    expect(matchesCombo({ ...base, key: "?", shiftKey: true }, "shift+?", false)).toBe(true);
    expect(matchesCombo({ ...base, key: "?" }, "shift+?", false)).toBe(false);
    expect(matchesCombo(base, "k", false)).toBe(true);
    expect(matchesCombo({ ...base, key: "j" }, "k", false)).toBe(false);
  });
});

describe("formatShortcut / ariaKeyShortcuts", () => {
  it("shows the keys of the platform", () => {
    expect(formatShortcut("mod+k", true)).toEqual(["⌘", "K"]);
    expect(formatShortcut("mod+k", false)).toEqual(["Ctrl", "K"]);
    expect(formatShortcut("mod+shift+p", true)).toEqual(["⌘", "⇧", "P"]);
    expect(formatShortcut("alt+ctrl+meta+up", false)).toEqual(["Alt", "Ctrl", "Win", "↑"]);
    expect(formatShortcut("g d", true)).toEqual(["G", "D"]);
    expect(formatShortcut("esc")).toEqual(["Esc"]);
    expect(formatShortcut("mod+x", true)[0]).toBe("⌘");
    expect(formatShortcut("weird+k", false)).toEqual(["weird", "K"]);
  });

  it("says a combination to assistive technology, never a sequence", () => {
    expect(ariaKeyShortcuts("mod+k", false)).toBe("Control+K");
    expect(ariaKeyShortcuts("mod+k", true)).toBe("Meta+K");
    expect(ariaKeyShortcuts("alt+shift+escape", true)).toBe("Alt+Shift+Escape");
    expect(ariaKeyShortcuts("g d")).toBeUndefined();
    expect(ariaKeyShortcuts("mod+k")).toMatch(/^(Meta|Control)\+K$/);
  });

  it("knows the platform only after the first client render", () => {
    const { result } = renderHook(() => useApple());
    expect(result.current).toBe(false);
  });
});

describe("useShortcuts", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "platform", { value: "Linux x86_64", configurable: true });
  });

  it("runs a combination and stops the browser's own", () => {
    const run = vi.fn();
    renderHook(() => useShortcuts({ "mod+k": run }));
    const event = key({ key: "k", ctrlKey: true });
    expect(run).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    key({ key: "k" });
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("runs a sequence, and forgets it after the timeout", () => {
    vi.useFakeTimers();
    const run = vi.fn();
    renderHook(() => useShortcuts({ "g d": run }));
    key({ key: "g" });
    key({ key: "d" });
    expect(run).toHaveBeenCalledTimes(1);
    key({ key: "g" });
    vi.advanceTimersByTime(1000);
    key({ key: "d" });
    expect(run).toHaveBeenCalledTimes(1);
    key({ key: "x" });
    key({ key: "g" });
    key({ key: "d" });
    expect(run).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("stays out of text fields for plain keys, but not for a combination with mod", () => {
    const sequence = vi.fn();
    const combo = vi.fn();
    const single = vi.fn();
    renderHook(() => useShortcuts({ "g d": sequence, "mod+k": combo, "?": single }));
    const input = document.createElement("input");
    document.body.append(input);
    key({ key: "g" }, input);
    key({ key: "d" }, input);
    key({ key: "?" }, input);
    key({ key: "k", ctrlKey: true }, input);
    expect(sequence).not.toHaveBeenCalled();
    expect(single).not.toHaveBeenCalled();
    expect(combo).toHaveBeenCalledTimes(1);
    const rich = document.createElement("div");
    Object.defineProperty(rich, "isContentEditable", { value: true });
    document.body.append(rich);
    key({ key: "k", ctrlKey: true }, rich);
    expect(combo).toHaveBeenCalledTimes(1);
    input.remove();
    rich.remove();
  });

  it("ignores repeats, composition, a prevented event and a key without a name; and can be turned off", () => {
    const run = vi.fn();
    const { rerender } = renderHook(({ enabled }) => useShortcuts({ "mod+k": run }, { enabled }), { initialProps: { enabled: true } });
    key({ key: "k", ctrlKey: true, repeat: true });
    key({ key: "k", ctrlKey: true, isComposing: true });
    key({ key: "" , ctrlKey: true });
    const prevented = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true });
    document.addEventListener("keydown", (e) => e.preventDefault(), { once: true, capture: true });
    document.body.dispatchEvent(prevented);
    expect(run).not.toHaveBeenCalled();
    rerender({ enabled: false });
    key({ key: "k", ctrlKey: true });
    expect(run).not.toHaveBeenCalled();
  });

  it("skips an undefined handler, follows the latest one, and lets go when the component leaves", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(({ handler }) => useShortcuts({ "mod+k": handler, "mod+j": undefined }), { initialProps: { handler: first } });
    rerender({ handler: second });
    key({ key: "j", ctrlKey: true });
    key({ key: "k", ctrlKey: true });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
    key({ key: "k", ctrlKey: true });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("works through a real keyboard", async () => {
    const run = vi.fn();
    function Page() {
      useShortcuts({ "shift+?": run });
      return <button type="button">x</button>;
    }
    render(<Page />);
    await userEvent.setup().keyboard("{Shift>}?{/Shift}");
    expect(run).toHaveBeenCalledTimes(1);
    act(() => undefined);
  });
});
