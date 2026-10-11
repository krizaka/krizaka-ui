import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Field, FloatingInput, Input, Select, Textarea } from "./index";

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

describe("Field — affixes and floating label", () => {
  it("puts start and end inside one well, the input bare, with no axe violation", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label htmlFor="price">Price</Field.Label>
        <Input id="price" start="€" end="per month" />
      </Field.Root>,
    );
    const input = screen.getByLabelText("Price");
    const group = input.closest("[data-slot=input-group]") as HTMLElement;
    expect(group.className).toContain("inset-shadow-well");
    expect(group.className).toContain("focus-within:focus-ring-inset");
    expect(group.querySelector("[data-slot=start]")?.textContent).toBe("€");
    expect(group.querySelector("[data-slot=end]")?.textContent).toBe("per month");
    expect(input.className).not.toContain("border");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders a plain input without affixes (the 2.x markup)", () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(container.firstElementChild?.tagName).toBe("INPUT");
  });

  it("names a FloatingInput by its label, resting in the field, with no axe violation", async () => {
    const { container } = render(<FloatingInput id="name" label="Full name" invalid />);
    const input = screen.getByLabelText("Full name");
    expect(input.getAttribute("placeholder")).toBe(" ");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });
});
