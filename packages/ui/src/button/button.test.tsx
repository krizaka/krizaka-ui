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

  it("signals loading: disabled, aria-busy, data-loading", () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.hasAttribute("data-loading")).toBe(true);
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
});
