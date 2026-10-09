import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Field, Input, Select, Textarea } from "./index";

describe("Field", () => {
  it("wires a label, a hint and an error to an input, with no axe violation", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label htmlFor="email">Email</Field.Label>
        <Input id="email" type="email" invalid aria-describedby="email-hint email-error" />
        <Field.Hint id="email-hint">We never share it.</Field.Hint>
        <Field.Error id="email-error">Enter a valid address.</Field.Error>
      </Field.Root>,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.hasAttribute("data-invalid")).toBe(true);
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid address.");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is valid by default", () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByLabelText("Name");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("data-invalid")).toBe(false);
  });

  it("lets the product's className win", () => {
    render(<Input aria-label="Name" className="h-9 rounded-full" />);
    const classes = screen.getByLabelText("Name").className.split(" ");
    expect(classes).toContain("h-9");
    expect(classes).not.toContain("h-11");
    expect(classes).toContain("rounded-full");
    expect(classes).not.toContain("rounded-lg");
  });

  it("renders a textarea and a native select, with no axe violation", async () => {
    const { container } = render(
      <>
        <Textarea aria-label="Bio" className="min-h-40" />
        <Select aria-label="Country" defaultValue="fr">
          <option value="fr">France</option>
          <option value="tn">Tunisia</option>
        </Select>
      </>,
    );
    const textarea = screen.getByLabelText("Bio");
    expect(textarea.className).toContain("min-h-40");
    expect(textarea.className).not.toContain("min-h-24");
    expect((screen.getByLabelText("Country") as HTMLSelectElement).value).toBe("fr");
    expect(await axeViolations(container)).toEqual([]);
  });
});
