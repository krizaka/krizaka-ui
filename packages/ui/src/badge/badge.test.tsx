import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Badge, badgeVariants } from "./index";

describe("Badge", () => {
  it("exposes its tone and has no axe violation", async () => {
    const { container } = render(
      <Badge tone="danger" dot pulse>
        Live
      </Badge>,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.tone).toBe("danger");
    expect(badge.querySelector("[data-dot]")?.getAttribute("aria-hidden")).toBe("true");
    expect(badge.textContent).toBe("Live");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("defaults to the neutral tone", () => {
    const { container } = render(<Badge>New</Badge>);
    expect((container.firstElementChild as HTMLElement).dataset.tone).toBe("neutral");
  });

  it("lets the product's className win", () => {
    const { container } = render(<Badge className="px-4 normal-case">x</Badge>);
    const classes = (container.firstElementChild as HTMLElement).className.split(" ");
    expect(classes).toContain("px-4");
    expect(classes).not.toContain("px-2");
    expect(classes).toContain("normal-case");
    expect(classes).not.toContain("uppercase");
  });

  it("styles anything through badgeVariants", () => {
    expect(badgeVariants({ tone: "scrim" })).toContain("bg-scrim");
  });
});

describe("Badge — the signature", () => {
  it("speaks in the mono voice, its dot a node, and takes the cut shape", () => {
    const { container } = render(
      <Badge shape="cut" tone="success" dot>
        Live
      </Badge>,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.className).toContain("font-mono");
    expect(badge.className).toContain("[corner-shape:bevel]");
    expect(badge.className).toContain("bg-success-soft");
    expect(badgeVariants()).toContain("rounded-full");
  });
});
