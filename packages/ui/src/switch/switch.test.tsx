import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Field } from "../field";
import { axeViolations } from "../test/axe";
import { Switch } from "./index";

describe("Switch", () => {
  it("is a named switch that Space and a click toggle, with no axe violation", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { container } = render(<Switch label="Autoplay" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch", { name: "Autoplay" });
    expect(sw.getAttribute("aria-checked")).toBe("false");
    await user.tab();
    await user.keyboard(" ");
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(sw.dataset.state).toBe("checked");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.click(sw);
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is named by a visible label, and marks itself invalid", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label htmlFor="emails">Email notifications</Field.Label>
        <Switch id="emails" invalid defaultChecked />
      </Field.Root>,
    );
    const sw = screen.getByRole("switch", { name: "Email notifications" });
    expect(sw.getAttribute("aria-invalid")).toBe("true");
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("does nothing when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch label="Autoplay" disabled />);
    await user.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
  });
});
