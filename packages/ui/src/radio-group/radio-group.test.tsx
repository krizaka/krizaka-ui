import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { RadioGroup } from "./index";

describe("RadioGroup", () => {
  it("chooses one with the arrows (one tab stop), with no axe violation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup.Root label="Frequency" defaultValue="daily" onValueChange={onValueChange}>
        <RadioGroup.Item value="instant">Instant</RadioGroup.Item>
        <RadioGroup.Item value="daily">Daily</RadioGroup.Item>
        <RadioGroup.Item value="weekly">Weekly</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    expect(screen.getByRole("radiogroup", { name: "Frequency" })).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Daily" }));
    // Radix checks on the focus that follows a held arrow key: press, then release.
    await user.keyboard("{ArrowDown>}");
    await user.keyboard("{/ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith("weekly");
    expect(screen.getByRole("radio", { name: "Weekly" }).getAttribute("aria-checked")).toBe("true");
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("makes a whole card the radio", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RadioGroup.Root label="Amount" defaultValue="5" orientation="horizontal">
        <RadioGroup.Card value="5">
          <span>$5</span>
          <span>A coffee</span>
        </RadioGroup.Card>
        <RadioGroup.Card value="20">
          <span>$20</span>
          <span>A dinner</span>
        </RadioGroup.Card>
      </RadioGroup.Root>,
    );
    const card = screen.getByRole("radio", { name: "$20 A dinner" });
    await user.click(card);
    expect(card.dataset.state).toBe("checked");
    expect(card.className).toContain("data-[state=checked]:border-accent");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("RadioGroup looks", () => {
  it("tactile keys: radios whose hint is part of the name, the chosen one pressed in", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RadioGroup.Root label="Tip" variant="buttons" defaultValue="15">
        <RadioGroup.Button value="10" hint="$4.20">
          10 %
        </RadioGroup.Button>
        <RadioGroup.Button value="15" hint="$6.30">
          15 %
        </RadioGroup.Button>
      </RadioGroup.Root>,
    );
    expect(await axeViolations(container)).toEqual([]);
    const chosen = screen.getByRole("radio", { name: "15 % $6.30" });
    expect(chosen.getAttribute("data-state")).toBe("checked");
    await user.click(screen.getByRole("radio", { name: "10 % $4.20" }));
    expect(screen.getByRole("radio", { name: "10 % $4.20" }).getAttribute("aria-checked")).toBe("true");
  });

  it("segmented: a horizontal radio group of segments", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup.Root label="Billing" variant="segmented" defaultValue="monthly" onValueChange={onValueChange}>
        <RadioGroup.Segment value="monthly">Monthly</RadioGroup.Segment>
        <RadioGroup.Segment value="yearly">Yearly</RadioGroup.Segment>
      </RadioGroup.Root>,
    );
    expect(await axeViolations(container)).toEqual([]);
    expect(screen.getByRole("radiogroup", { name: "Billing" }).getAttribute("aria-orientation")).toBe("horizontal");
    await user.tab();
    await user.keyboard("{ArrowRight>}");
    await user.keyboard("{/ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith("yearly");
  });

  it("cards carry a check that shows once chosen", () => {
    const { container } = render(
      <RadioGroup.Root label="Amount" variant="cards" defaultValue="20">
        <RadioGroup.Card value="5">$5</RadioGroup.Card>
        <RadioGroup.Card value="20">$20</RadioGroup.Card>
      </RadioGroup.Root>,
    );
    expect(container.querySelectorAll('[role=radio] [data-state="checked"] svg')).toHaveLength(1);
  });
});
