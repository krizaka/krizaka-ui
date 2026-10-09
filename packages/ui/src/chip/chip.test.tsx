import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { Chip } from "./index";

describe("Chip", () => {
  it("toggles alone: aria-pressed and data-state, with no axe violation", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const { container } = render(<Chip onSelectedChange={onSelectedChange}>1.5×</Chip>);
    const chip = screen.getByRole("button", { name: "1.5×" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    await user.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(chip.dataset.state).toBe("on");
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("chooses one in a single group: radios, arrows move the focus, Space selects", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Chip.Group type="single" label="Format" defaultValue="all" onValueChange={onValueChange}>
        <Chip value="all">All</Chip>
        <Chip value="video">Videos</Chip>
        <Chip value="story">Stories</Chip>
      </Chip.Group>,
    );
    expect(screen.getByRole("radiogroup", { name: "Format" })).toBeTruthy();
    const all = screen.getByRole("radio", { name: "All" });
    expect(all.getAttribute("aria-checked")).toBe("true");
    await user.tab();
    expect(document.activeElement).toBe(all);
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Videos" }));
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("video");
    expect(screen.getByRole("radio", { name: "Videos" }).getAttribute("aria-checked")).toBe("true");
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Stories" }));
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps one chosen when required", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState("all");
      return (
        <Chip.Group type="single" label="Format" required value={value} onValueChange={setValue}>
          <Chip value="all">All</Chip>
          <Chip value="video">Videos</Chip>
        </Chip.Group>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole("radio", { name: "All" }));
    expect(screen.getByRole("radio", { name: "All" }).getAttribute("aria-checked")).toBe("true");
  });

  it("chooses several in a multiple group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Chip.Group type="multiple" label="Tags" onValueChange={onValueChange}>
        <Chip value="night">Night</Chip>
        <Chip value="city">City</Chip>
      </Chip.Group>,
    );
    await user.click(screen.getByRole("button", { name: "Night" }));
    await user.click(screen.getByRole("button", { name: "City" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["night", "city"]);
    expect(screen.getByRole("button", { name: "City" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("removes a removable chip with its named button", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(
      <Chip removable removeLabel="Remove #night" onRemove={onRemove}>
        #night
      </Chip>,
    );
    await user.click(screen.getByRole("button", { name: "Remove #night" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});
