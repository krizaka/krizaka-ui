import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { Combobox, type ComboboxOption } from "./index";

const FRUITS: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "creme", label: "Crème brûlée" },
];

describe("Combobox", () => {
  it("follows the combobox pattern, with no axe violation", async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox label="Fruit" options={FRUITS} />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    expect(input.getAttribute("aria-expanded")).toBe("false");
    await user.click(input);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox", { name: "Fruit" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("filters ignoring case and accents, walks with the arrows past disabled options, picks with Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Fruit" options={FRUITS} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "creme");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Crème brûlée"]);
    await user.clear(input);
    await user.keyboard("{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[0]?.id);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[3]?.id);
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith({ value: "creme", label: "Crème brûlée" });
    expect((input as HTMLInputElement).value).toBe("Crème brûlée");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes with Escape and restores the chosen label", async () => {
    const user = userEvent.setup();
    render(<Combobox label="Fruit" options={FRUITS} defaultValue={FRUITS[0]} />);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(input, "x");
    expect(input.value).toBe("Applex");
    await user.keyboard("{Escape}");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    await user.keyboard("{Escape}");
    expect(input.value).toBe("Apple");
  });

  it("holds several values as chips; Backspace removes the last; at most maxSelected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox multiple label="Fruits" options={FRUITS} defaultValue={[FRUITS[0]!]} maxSelected={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    expect(screen.getByRole("button", { name: "Remove Apple" })).toBeTruthy();
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Apricot" }));
    expect(onValueChange).toHaveBeenLastCalledWith([FRUITS[0], FRUITS[1]]);
    expect(screen.getByRole("option", { name: /Crème/ }).getAttribute("aria-disabled")).toBe("true");
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith([FRUITS[0]]);
  });

  it("creates a value from the query", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Playlist" options={FRUITS} creatable onValueChange={onValueChange} />);
    await user.type(screen.getByRole("combobox"), "Road trip");
    expect(screen.getByRole("option", { name: "Create “Road trip”" })).toBeTruthy();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith({ value: "Road trip", label: "Road trip" });
  });

  it("searches a server once typing pauses, aborting the stale request", async () => {
    // The clock is the test's (krizaka-ui#115): with real timers, a keystroke gap longer than the debounce — a loaded CI
    // runner — searched "a" before "ap". The text now changes at known instants, and the pause is advanced on purpose.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const signals: AbortSignal[] = [];
      const onSearch = vi.fn(async (query: string, signal: AbortSignal) => {
        signals.push(signal);
        return FRUITS.filter((f) => f.label.toLowerCase().startsWith(query.toLowerCase()));
      });
      render(<Combobox label="Fruit" onSearch={onSearch} debounce={40} />);
      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.change(input, { target: { value: "ap" } });
      await act(async () => vi.advanceTimersByTime(39));
      expect(onSearch).not.toHaveBeenCalled();
      await act(async () => vi.advanceTimersByTime(1));
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenLastCalledWith("ap", expect.any(AbortSignal));
      expect(screen.getAllByRole("option")).toHaveLength(2);
      fireEvent.change(input, { target: { value: "apr" } });
      await act(async () => vi.advanceTimersByTime(40));
      expect(onSearch).toHaveBeenCalledTimes(2);
      expect(signals[0]?.aborted).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("searches what was typed so far when typing pauses longer than the debounce", async () => {
    // What made #115 flaky is the debounce working as designed: a pause longer than `debounce` between two keys
    // searches the text typed so far.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const onSearch = vi.fn(async (_query: string) => FRUITS);
      render(<Combobox label="Fruit" onSearch={onSearch} debounce={40} />);
      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "a" } });
      await act(async () => vi.advanceTimersByTime(60));
      fireEvent.change(input, { target: { value: "ap" } });
      await act(async () => vi.advanceTimersByTime(40));
      expect(onSearch.mock.calls.map(([query]) => query)).toEqual(["a", "ap"]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("wires the hint and the error to the input", () => {
    render(<Combobox label="Country" options={FRUITS} hint="Where you live." error="Choose a country." />);
    const input = screen.getByRole("combobox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const described = input.getAttribute("aria-describedby")!.split(" ").map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual(["Where you live.", "Choose a country."]);
  });
});
