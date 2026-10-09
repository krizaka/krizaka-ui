import { render, screen } from "@testing-library/react";

import { Separator } from "./index";

describe("Separator", () => {
  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    const line = container.firstChild as HTMLElement;
    expect(line.getAttribute("role")).toBe("none");
    expect(line.className).toContain("h-px");
  });

  it("is a vertical separator for assistive technology when not decorative", () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const line = screen.getByRole("separator");
    expect(line.getAttribute("aria-orientation")).toBe("vertical");
    expect(line.className).toContain("w-px");
  });
});
