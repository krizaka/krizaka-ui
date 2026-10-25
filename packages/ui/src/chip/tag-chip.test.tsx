import { MARKERS as contract } from "@krizaka/organize/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { Chip, MarkerPicker, MARKERS, TagChip, TagMarker } from "./index";
import { TAG_MARKERS } from "./markers";

const NAMES = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

describe("TagChip (#627)", () => {
  it("offers the six names of the contract, no more", () => {
    expect([...MARKERS]).toEqual([...contract]);
    expect([...TAG_MARKERS]).toEqual([...contract]);
    expect(contract).toHaveLength(6);
  });

  it("is named by the tag's name alone: the marker is decorative, and sits beside it, never filling the chip", async () => {
    const { container } = render(<TagChip marker="violet">Gift cards</TagChip>);
    const chip = screen.getByRole("button", { name: "Gift cards" });
    const marker = chip.querySelector("[data-marker]") as HTMLElement;
    expect(marker.getAttribute("aria-hidden")).toBe("true");
    expect(marker.dataset.marker).toBe("violet");
    expect(marker.style.getPropertyValue("--kz-marker")).toBe("var(--kz-tag-violet)");
    expect(chip.className).not.toMatch(/bg-\(--kz-marker\)/);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws a dot or Yomizaka's ribbon", () => {
    const { container } = render(
      <>
        <TagMarker marker="red" />
        <TagMarker marker="green" shape="ribbon" />
      </>,
    );
    const [dot, ribbon] = [...container.querySelectorAll<HTMLElement>("[data-marker]")];
    expect(dot!.dataset.shape).toBe("dot");
    expect(ribbon!.dataset.shape).toBe("ribbon");
  });

  it("filters inside Chip.Group (pressed buttons) and is removable with a named button", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <>
        <Chip.Group type="multiple" label="Tags" onValueChange={onValueChange}>
          <TagChip value="late" marker="red">Late payer</TagChip>
          <TagChip value="vip" marker="blue">Regular</TagChip>
        </Chip.Group>
        <TagChip marker="gray" shape="ribbon" removable removeLabel="Remove the tag Winter storage" onRemove={onRemove}>
          Winter storage
        </TagChip>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Late payer" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["late"]);
    await user.click(screen.getByRole("button", { name: "Remove the tag Winter storage" }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe("MarkerPicker (#627)", () => {
  it("is a radio group of named swatches; the arrows move and choose, the chosen one is ticked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<MarkerPicker label="Colour of the tag" names={NAMES} defaultValue="blue" onValueChange={onValueChange} />);
    const group = screen.getByRole("radiogroup", { name: "Colour of the tag" });
    const radios = screen.getAllByRole("radio");
    expect(radios.map((r) => r.getAttribute("aria-label"))).toEqual(["Blue", "Green", "Amber", "Red", "Violet", "Gray"]);
    expect(group.querySelectorAll('[data-state="checked"] svg')).toHaveLength(1);
    radios[0]!.focus();
    await user.keyboard("{ArrowRight>}");
    await user.keyboard("{/ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("green");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("offers only the colours it is given", () => {
    render(<MarkerPicker label="Colour" names={NAMES} markers={["blue", "red"]} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});
