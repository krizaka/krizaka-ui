import { fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { GlowCard } from "./index";

describe("GlowCard", () => {
  it("renders its content lit by the brand, with no axe violation", async () => {
    const { container } = render(
      <GlowCard alive>
        <h3>Team</h3>
      </GlowCard>,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("kz-glow");
    expect(card.dataset.glow).toBe("both");
    expect(card.hasAttribute("data-alive")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("no longer follows the pointer: no bloom variables (krizaka-ui#393)", () => {
    const { container } = render(<GlowCard>Hi</GlowCard>);
    const card = container.firstElementChild as HTMLElement;
    fireEvent.pointerMove(card, { clientX: 40, clientY: 25 });
    expect(card.style.getPropertyValue("--kz-glow-x")).toBe("");
    expect(card.style.getPropertyValue("--kz-glow-y")).toBe("");
  });

  it("becomes the link with asChild", () => {
    render(
      <GlowCard asChild glow="border">
        <a href="#x">Docs</a>
      </GlowCard>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.className).toContain("kz-glow");
    expect(link.dataset.glow).toBe("border");
  });
});
