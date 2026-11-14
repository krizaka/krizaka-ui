import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectTypeOf } from "vitest";

import { Checkbox, type CheckboxProps } from "../checkbox";
import { Field } from "../field";
import { axeViolations } from "../test/axe";
import { Switch, type SwitchProps } from "./index";

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

  describe("settings row", () => {
    it("is one switch named by its words, hinted by its description, toggled by a click anywhere on the row", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Switch defaultChecked={false} className="extra">
          Weekly digest
        </Switch>,
      );
      expect(screen.getAllByRole("switch")).toHaveLength(1);
      await user.click(screen.getByText("Weekly digest"));
      expect(screen.getByRole("switch", { name: "Weekly digest" }).getAttribute("aria-checked")).toBe("true");
      expect(container.querySelector("label")?.className).toContain("extra");
      expect(await axeViolations(container)).toEqual([]);
    });

    it("reads the description as the hint, not as part of the name", () => {
      render(<Switch description="One email on Monday.">Weekly digest</Switch>);
      const sw = screen.getByRole("switch", { name: "Weekly digest" });
      expect(sw.getAttribute("aria-describedby")).toBeTruthy();
      expect(document.getElementById(sw.getAttribute("aria-describedby") ?? "")?.textContent).toBe("One email on Monday.");
    });

    it("puts the words before the switch and is at least 44 px high", () => {
      render(<Switch>Autoplay</Switch>);
      const row = screen.getByText("Autoplay").closest("label");
      const sw = screen.getByRole("switch");
      expect(row?.className).toContain("min-h-11");
      expect(row?.className).toContain("justify-between");
      expect(screen.getByText("Autoplay").compareDocumentPosition(sw) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it.each(["ltr", "rtl"] as const)("keeps the checkbox before its text and the switch after its text under dir=%s", (dir) => {
      render(
        <div dir={dir}>
          <Checkbox>Remember me</Checkbox>
          <Switch>Autoplay</Switch>
        </div>,
      );
      const box = screen.getByRole("checkbox");
      const sw = screen.getByRole("switch");
      const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      expect(follows(box, screen.getByText("Remember me"))).toBe(true);
      expect(follows(screen.getByText("Autoplay"), sw)).toBe(true);
      // Flex follows the writing direction: no physical side in the row, so `dir="rtl"` mirrors both.
      const classes = [box.closest("label"), sw.closest("label")].map((l) => `${l?.className} ${l?.querySelector("span")?.className}`).join(" ");
      expect(classes).not.toMatch(/\b(?:-?m[lr]-|p[lr]-|left-|right-|text-(?:left|right)|float-|flex-row-reverse)/);
    });

    it("refuses an align prop on Checkbox and Switch", () => {
      expectTypeOf<SwitchProps>().not.toHaveProperty("align");
      expectTypeOf<CheckboxProps>().not.toHaveProperty("align");
      // @ts-expect-error — the target has no left / right / centre: start and end by role
      render(<Switch label="Autoplay" align="right" />);
      // @ts-expect-error — the same for Checkbox
      render(<Checkbox align="center">Remember me</Checkbox>);
    });
  });
});
