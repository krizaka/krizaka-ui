import { render, screen } from "@testing-library/react";

import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies default variant styling", () => {
    const { container } = render(<Badge>Default</Badge>);
    const span = container.querySelector("span");
    // The shape belongs to @krizaka/ui (Cahier: square corners since 3.37): pin the variant, not the radius.
    expect(span?.className).toContain("bg-surface-3");
  });

  it("applies success variant", () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-success/15");
    expect(span).toHaveAttribute("data-tone", "success");
  });

  it("applies warning variant", () => {
    const { container } = render(<Badge variant="warning">Warn</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-warning/15");
  });

  it("applies danger variant", () => {
    const { container } = render(<Badge variant="danger">Error</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-danger/15");
  });

  it("applies accent variant", () => {
    const { container } = render(<Badge variant="accent">AI</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("accent");
  });

  it("maps the deprecated default variant to the neutral tone", () => {
    const { container } = render(<Badge variant="default">Default</Badge>);
    expect(container.querySelector("span")).toHaveAttribute("data-tone", "neutral");
  });

  it("prefers tone over the deprecated variant", () => {
    const { container } = render(
      <Badge variant="danger" tone="success">
        Both
      </Badge>,
    );
    expect(container.querySelector("span")).toHaveAttribute("data-tone", "success");
  });

  it("uses roles only, no mode variant", () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    expect(container.querySelector("span")?.className).not.toMatch(/dark[:]|emerald/);
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const span = container.querySelector("span");
    expect(span?.className).toContain("custom-class");
  });

  it("passes additional HTML attributes", () => {
    render(<Badge data-testid="badge-test">Test</Badge>);
    expect(screen.getByTestId("badge-test")).toBeInTheDocument();
  });
});
