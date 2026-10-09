import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Field } from "../field";
import { axeViolations } from "../test/axe";
import { Checkbox } from "./index";

describe("Checkbox", () => {
  it("is checked by Space and by a click on its words, with no axe violation", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { container } = render(<Checkbox onCheckedChange={onCheckedChange}>I accept the terms</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "I accept the terms" });
    await user.click(screen.getByText("I accept the terms"));
    expect(box.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    box.focus();
    await user.keyboard(" ");
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("sits in a Field: label, error, invalid; and shows a mixed state", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label htmlFor="all">Select all</Field.Label>
        <Checkbox id="all" checked="indeterminate" invalid aria-describedby="all-error" />
        <Field.Error id="all-error">Pick at least one.</Field.Error>
      </Field.Root>,
    );
    const box = screen.getByRole("checkbox", { name: "Select all" });
    expect(box.getAttribute("aria-checked")).toBe("mixed");
    expect(box.getAttribute("aria-invalid")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });
});
