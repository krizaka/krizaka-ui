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
