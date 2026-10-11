import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Button, buttonVariants, IconButton } from "./index";

describe("Button", () => {
  it("renders a type=button with its variant, and no axe violation", async () => {
    const { container } = render(<Button variant="primary">Continue</Button>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.dataset.variant).toBe("primary");
    expect(button.className).toContain("bg-accent");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the gradient look from the accent to the second accent, label on-accent", async () => {
    const { container } = render(<Button variant="gradient">Start</Button>);
    const button = screen.getByRole("button", { name: "Start" });
    expect(button.dataset.variant).toBe("gradient");
    for (const c of ["bg-linear-to-r", "from-accent", "to-accent-2", "text-on-accent"]) expect(button.className).toContain(c);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("signals loading: disabled, aria-busy, data-loading, the glyph before the label", () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.hasAttribute("data-loading")).toBe(true);
    expect(button.querySelector("[data-slot=indicator] .kz-loader-trace")).not.toBeNull();
    expect(button.textContent).toBe("Saving");
  });

  it("keeps the glyph out with indicator={false}, and out of asChild", () => {
    const { rerender } = render(
      <Button loading indicator={false}>
        Saving
      </Button>,
    );
    expect(screen.getByRole("button").querySelector("[data-slot=indicator]")).toBeNull();
    rerender(
      <Button asChild loading>
        <a href="#x">Go</a>
      </Button>,
    );
    expect(screen.getByRole("link").querySelector("[data-slot=indicator]")).toBeNull();
  });

  it("grows a fill and the trace with progress", () => {
    render(
      <Button loading progress={0.4}>
        Exporting
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.querySelector<HTMLElement>("span[style]")?.style.width).toBe("40%");
    expect(button.querySelector("svg")?.getAttribute("data-progress")).toBe("40");
  });

  it("draws and announces how the action ended", async () => {
    const { container } = render(
      <Button status="error" announce="Payment declined">
        Pay
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Pay" });
    expect(button.dataset.kzStatus).toBe("error");
    expect(button.querySelector("svg")?.getAttribute("data-state")).toBe("error");
    expect(screen.getByRole("status").textContent).toBe("Payment declined");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("wears the signature: cut corners, sheen, magnetism", () => {
    render(
      <Button shape="cut" shimmer magnetic>
        Start
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("[corner-shape:bevel]");
    expect(button.className).toContain("kz-sheen");
    expect(button.hasAttribute("data-kz-magnetic")).toBe(true);
  });

  it("lets the product's className win", () => {
    render(<Button size="sm" className="h-14 px-8">Big</Button>);
    const classes = screen.getByRole("button").className.split(" ");
    expect(classes).toContain("h-14");
    expect(classes).toContain("px-8");
    expect(classes).not.toContain("h-8");
    expect(classes).not.toContain("px-3");
  });

  it("renders its child with asChild, without a type and with the classes merged", async () => {
    const { container } = render(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.hasAttribute("type")).toBe(false);
    expect(link.className).toContain("border-border-default");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("styles anything through buttonVariants", () => {
    expect(buttonVariants({ variant: "ghost", size: "lg" })).toContain("h-12");
  });
});

describe("IconButton", () => {
  it("is named by its label", async () => {
    const { container } = render(
      <IconButton label="Close">
        <svg aria-hidden />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.getAttribute("title")).toBe("Close");
    expect(button.className).toContain("w-10");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("puts the glyph in the icon's place while loading", () => {
    render(
      <IconButton label="Refresh" loading>
        <svg data-testid="icon" aria-hidden />
      </IconButton>,
    );
    expect(screen.queryByTestId("icon")).toBeNull();
    expect(screen.getByRole("button", { name: "Refresh" }).querySelector(".kz-loader-trace")).not.toBeNull();
  });
});
