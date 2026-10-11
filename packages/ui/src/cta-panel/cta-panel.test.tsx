import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { CtaPanel } from "./index";

describe("CtaPanel", () => {
  it("renders the invitation, why and the actions, with no axe violation", async () => {
    const { container } = render(
      <CtaPanel id="discuss" title="Something to say?" body="The discussions are open." reveal>
        <a href="#d">Discuss</a>
      </CtaPanel>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Something to say?" }).id).toBe("discuss");
    expect(container.firstElementChild?.hasAttribute("data-reveal")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("can be an h3", () => {
    render(<CtaPanel title="Later" level={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Later" })).toBeTruthy();
  });
});
