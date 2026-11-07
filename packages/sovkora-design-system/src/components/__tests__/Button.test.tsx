import { fireEvent,render, screen } from "@testing-library/react";

import { Button } from "../Button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    const { container } = render(<Button>Primary</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-accent");
    expect(btn?.className).toContain("text-on-accent");
  });

  it("applies secondary variant", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-surface-2");
  });

  it("applies outline variant", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-transparent");
  });

  it("applies ghost variant", () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("text-fg-secondary");
    expect(btn?.className).not.toContain("bg-accent");
  });

  it("applies sm size", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("h-8");
  });

  it("applies md size by default", () => {
    const { container } = render(<Button>Medium</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("h-10");
  });

  it("applies lg size", () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("h-12");
  });

  it("applies icon size", () => {
    const { container } = render(<Button size="icon">🔍</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-10");
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Button className="extra">Extra</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("extra");
    // The base shape survives a custom class. The radius itself is @krizaka/ui's token (it moved from lg to sm with
    // the 3.32 steel-blue Button), so the test asks for a rounded-* utility, not for one value.
    expect(btn?.className).toMatch(/\brounded-\w+/);
  });

  it("lets a className override win over the variant (tailwind-merge)", () => {
    const { container } = render(
      <Button variant="primary" size="sm" className="h-9 bg-surface-3">
        Override
      </Button>,
    );
    const classes = container.querySelector("button")?.className.split(" ") ?? [];
    expect(classes).toContain("bg-surface-3");
    expect(classes).not.toContain("bg-accent");
    expect(classes).toContain("h-9");
    expect(classes).not.toContain("h-8");
  });

  it("renders its child with asChild", () => {
    render(
      <Button asChild>
        <a href="/chat">Chat</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Chat" }).className).toContain("bg-accent");
  });
});
