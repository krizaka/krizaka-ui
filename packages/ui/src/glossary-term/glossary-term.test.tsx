import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { GlossaryTerm } from "./index";

describe("GlossaryTerm", () => {
  it("underlines the host's word and opens its definition from the keyboard", async () => {
    const user = userEvent.setup();
    const { container } = render(<GlossaryTerm term="Marge brute" definition="La part des ventes qui reste après le coût des produits." />);
    const trigger = screen.getByText("Marge brute");
    expect(trigger.className).toContain("kz-glossary-term");
    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip.textContent).toBe("La part des ventes qui reste après le coût des produits.");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(await axeViolations(container)).toEqual([]);
  });
});
