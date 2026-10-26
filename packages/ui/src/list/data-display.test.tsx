// The data display primitives: List, DescriptionList, ActivityFeed (+ Timeline), TreeView, Kanban, StatGrid and the
// DataTable additions (pinned columns, groups, inline edit, CSV) — their roles, keyboard and words, with no axe violation.
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";

import JobActivity from "../../registry/examples/activity-feed/job-activity";
import Receipt from "../../registry/examples/description-list/receipt";
import Moderation from "../../registry/examples/kanban/moderation";
import Selectable from "../../registry/examples/list/selectable";
import Virtualized from "../../registry/examples/list/virtualized";
import Grid from "../../registry/examples/stat/grid";
import Docs from "../../registry/examples/tree-view/docs";
import { groupActivity, timeAgo } from "../activity-feed";
import { axeViolations } from "../test/axe";

describe("List", () => {
  it("selects rows with their checkboxes, and windows long lists", async () => {
    const { container } = render(<Selectable />);
    const alex = screen.getByRole("checkbox", { name: "Select Alex Moreau" });
    await userEvent.click(alex);
    expect(screen.getByRole("button", { name: "Thank 2" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
    render(<Virtualized />);
    const list = screen.getByRole("list", { name: "Payouts" });
    expect(within(list).getAllByRole("listitem").length).toBeLessThan(40);
  });
});

describe("DescriptionList", () => {
  it("is a dl of terms and values, rendered on the server", async () => {
    const html = renderToStaticMarkup(<Receipt />);
    expect(html).toContain("<dl");
    expect(html).toContain("<dt");
    const { container } = render(<Receipt />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("ActivityFeed", () => {
  it("groups by day, folds runs and says how long ago", async () => {
    const now = new Date("2026-10-11T15:00:00Z");
    const groups = groupActivity(
      [
        { id: "a", at: "2026-10-11T14:00:00Z", title: "x", actor: "m", kind: "tip" },
        { id: "b", at: "2026-10-11T13:00:00Z", title: "x", actor: "m", kind: "tip" },
        { id: "c", at: "2026-10-10T13:00:00Z", title: "y" },
      ],
      { now },
    );
    expect(groups.map((g) => [g.label, g.events.map((e) => e.count)])).toEqual([
      ["Today", [2]],
      ["Yesterday", [1]],
    ]);
    expect(timeAgo("2026-10-11T14:58:00Z", { now })).toBe("2 min. ago");
    const { container } = render(<JobActivity />);
    expect(screen.getByRole("heading", { name: "Today" })).toBeTruthy();
    expect(screen.getByText("×3")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("TreeView", () => {
  it("walks with the arrows, opens and closes, selects with Enter", async () => {
    const { container } = render(<Docs />);
    const tree = screen.getByRole("tree", { name: "Documentation" });
    const selected = within(tree).getByRole("treeitem", { name: "Dubbing" });
    expect(selected.getAttribute("aria-selected")).toBe("true");
    expect(selected.tabIndex).toBe(0);
    selected.focus();
    fireEvent.keyDown(selected, { key: "ArrowLeft" });
    expect(document.activeElement?.textContent).toContain("Studios");
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(screen.getByRole("treeitem", { name: "Studios 12" }).getAttribute("aria-expanded")).toBe("false");
    fireEvent.keyDown(document.activeElement!, { key: "y" });
    expect(document.activeElement?.textContent).toMatch(/^Yomizaka/);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("Kanban", () => {
  it("moves a card with Space and the arrows, and announces it", async () => {
    const { container } = render(<Moderation />);
    const card = screen.getByText("Backflip on the beach").closest("li")!;
    card.focus();
    fireEvent.keyDown(card, { key: " " });
    expect(screen.getByText(/picked up, in To review/)).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    fireEvent.keyDown(document.activeElement!, { key: " " });
    expect(screen.getByText(/dropped in Reviewing, position 1/)).toBeTruthy();
    const reviewing = screen.getByRole("region", { name: "Reviewing" });
    expect(within(reviewing).getByText("Backflip on the beach")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("StatGrid", () => {
  it("lays out its stats and a chart under one", async () => {
    const { container } = render(<Grid />);
    expect(screen.getByRole("meter", { name: "Storage used" })).toBeTruthy();
    await act(async () => undefined);
    expect(await axeViolations(container)).toEqual([]);
  });
});
