import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { EmptyState } from "./index";

describe("EmptyState", () => {
  it("renders its words as a status, with no axe violation", async () => {
    const { container } = render(
      <EmptyState icon={<svg />} title="No videos yet" description="Your uploads appear here." action={<button type="button">Upload</button>} />,
    );
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("No videos yet");
    expect(status.textContent).toContain("Your uploads appear here.");
    expect(status.querySelector("[aria-hidden]")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    render(<EmptyState title="Nothing" className="py-4 border-solid" />);
    const classes = screen.getByRole("status").className.split(" ");
    expect(classes).toContain("py-4");
    expect(classes).not.toContain("py-10");
    expect(classes).toContain("border-solid");
    expect(classes).not.toContain("border-dashed");
  });
});
