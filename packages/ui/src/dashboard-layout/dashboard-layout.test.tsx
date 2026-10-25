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

describe("DashboardLayout (Operate additions)", () => {
  it("puts the date beside the heading, links the figures of the lead, and lists 2 to 4 quick actions", async () => {
    const { container } = render(
      <DashboardLayout
        title="Good morning"
        date="Monday, October 26"
        description={<><a href="#a">2 invoices</a> wait.</>}
        quickActions={[1, 2, 3, 4, 5].map((n) => ({ id: `q${n}`, label: `Action ${n}`, hint: "one line", href: `#q${n}` }))}
        quickActionsLabel="Quick access"
        side={<p>Notes</p>}
      >
        <Widget title="Requests">1</Widget>
      </DashboardLayout>,
    );
    expect(screen.getByText("Monday, October 26")).toBeTruthy();
    expect(screen.getByRole("link", { name: "2 invoices" }).getAttribute("href")).toBe("#a");
    const nav = screen.getByRole("navigation", { name: "Quick access" });
    expect(nav.querySelectorAll("a")).toHaveLength(4);
    expect(screen.getByRole("complementary").textContent).toBe("Notes");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("stays a single grid without a side column or tiles", () => {
    const { container } = render(<DashboardLayout title="T"><Widget title="W">x</Widget></DashboardLayout>);
    expect(container.querySelector("aside")).toBeNull();
    expect(container.querySelector("nav")).toBeNull();
  });
});
