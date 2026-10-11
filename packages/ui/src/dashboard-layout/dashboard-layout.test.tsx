import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DashboardLayout, Widget } from "./index";

describe("DashboardLayout", () => {
  it("renders the heading, the actions and named widgets, with no axe violation", async () => {
    const { container } = render(
      <DashboardLayout title="Good morning" eyebrow="This week" description="Three sales." actions={<button type="button">New</button>} toolbar={<span>7 days</span>}>
        <Widget title="Requests">1,284</Widget>
        <Widget title="Usage" span="full" action={<a href="#all">All</a>}>
          chart
        </Widget>
      </DashboardLayout>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Good morning" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Requests" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Usage" }).className).toContain("col-span");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("can be an h2 inside a shell", () => {
    render(<DashboardLayout title="Studio" headingAs="h2"><Widget title="A">a</Widget></DashboardLayout>);
    expect(screen.getByRole("heading", { level: 2, name: "Studio" })).toBeTruthy();
  });
});
