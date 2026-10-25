import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { type TagOption,TagSelector } from "./index";

const NAMES = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };
const OPTIONS: TagOption[] = [
  { value: "regular", label: "Regular", marker: "blue" },
  { value: "late", label: "Late payer", marker: "red" },
  { value: "vip", label: "Gift cards", marker: "violet" },
];

function Harness({ onCreate, max, initial = ["regular"] }: { onCreate?: (name: string, marker: string) => void; max?: number; initial?: string[] }) {
  const [options, setOptions] = React.useState(OPTIONS);
  const [chosen, setChosen] = React.useState(initial);
  return (
    <TagSelector
      label="Tags of Eric" options={options} value={chosen} onValueChange={setChosen} max={max}
      creatable inputLabel="Add a tag" markerNames={NAMES} markerLabel="Colour of the new tag" emptyLabel="No tag of that name"
      countLabel={(n, m) => `${n} of ${m}`}
      onCreate={(name, marker) => {
        onCreate?.(name, marker);
        setOptions((all) => [...all, { value: name.toLowerCase(), label: name, marker }]);
        setChosen((all) => [...all, name.toLowerCase()]);
      }}
    />
  );
}

describe("TagSelector — markers and creatable (#627)", () => {
  it("draws a TagChip for an option with a marker, a plain chip without", () => {
    render(<TagSelector label="Tags" options={[...OPTIONS, { value: "x", label: "Plain" }]} value={[]} onValueChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Regular" }).querySelector("[data-marker=blue]")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Plain" }).querySelector("[data-marker]")).toBeNull();
  });

  it("narrows the tags as the person types and keeps the chosen ones in view", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: "Add a tag" }), "gift");
    const group = screen.getByRole("group", { name: "Tags of Eric" });
    expect(group.textContent).toContain("Gift cards");
    expect(group.textContent).toContain("Regular");
    expect(group.textContent).not.toContain("Late payer");
  });

  it("Enter chooses the tag of that name (case ignored) instead of creating a twin", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);
    await user.type(screen.getByRole("textbox", { name: "Add a tag" }), "LATE PAYER{Enter}");
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Late payer" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("Enter creates a new tag in the colour chosen from the closed palette", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const { container } = render(<Harness onCreate={onCreate} />);
    const input = screen.getByRole("textbox", { name: "Add a tag" });
    await user.type(input, "Pick-up");
    await user.click(screen.getByRole("radio", { name: "Green" }));
    expect(screen.getByRole("button", { name: "Create “Pick-up”" })).toBeTruthy();
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledWith("Pick-up", "green");
    expect((input as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("button", { name: "Pick-up" }).getAttribute("aria-pressed")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("collapses the spaces of a name and ignores an empty one", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);
    const input = screen.getByRole("textbox", { name: "Add a tag" });
    await user.type(input, "   {Enter}");
    expect(onCreate).not.toHaveBeenCalled();
    await user.type(input, "Winter   storage{Enter}");
    expect(onCreate).toHaveBeenCalledWith("Winter storage", "blue");
  });

  it("does not create past the limit, and Backspace on an empty field takes the last tag back", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} max={1} />);
    const input = screen.getByRole("textbox", { name: "Add a tag" });
    await user.type(input, "Extra{Enter}");
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Create “Extra”" })).toBeNull();
    await user.clear(input);
    await user.keyboard("{Backspace}");
    expect(screen.getByRole("button", { name: "Regular" }).getAttribute("aria-pressed")).toBe("false");
  });
});
