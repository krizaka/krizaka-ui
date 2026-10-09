import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { PageHeader } from "./index";

describe("PageHeader", () => {
  it("renders an h1, the description, the breadcrumb and the actions, with no axe violation", async () => {
    const { container } = render(
      <PageHeader
        title="Payouts"
        description="Your earnings, paid every Monday."
        breadcrumb={
          <nav aria-label="Breadcrumb">
            <a href="/studio">Studio</a>
          </nav>
        }
        actions={<button type="button">Export</button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Payouts" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("can be an h2", () => {
    render(<PageHeader as="h2" title="Settings" />);
    expect(screen.getByRole("heading", { level: 2, name: "Settings" })).toBeTruthy();
  });
});
