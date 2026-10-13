// The data display of /native: DescriptionList (each pair one element) and ActivityFeed (days, folds, “… ago”).
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

import { ActivityFeed } from "./activity-feed";
import { DescriptionList } from "./description-list";

describe("DescriptionList", () => {
  test("lists each pair as one element", async () => {
    await render(<DescriptionList items={[{ term: "Status", details: "Running" }, { term: "Credits", details: "120", hint: "estimated" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("estimated")).toBeTruthy();
  });
});

describe("ActivityFeed", () => {
  test("groups by day under headings and folds a run", async () => {
    const now = new Date("2026-10-11T15:00:00Z");
    await render(
      <ActivityFeed
        now={now}
        events={[
          { id: "a", at: "2026-10-11T14:00:00Z", title: "Mina tipped $5", actor: "mina", kind: "tip" },
          { id: "b", at: "2026-10-11T13:00:00Z", title: "Mina tipped $5", actor: "mina", kind: "tip" },
          { id: "c", at: "2026-10-10T13:00:00Z", title: "Payout sent" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Today" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Yesterday" })).toBeTruthy();
    expect(screen.getByText(/×2/)).toBeTruthy();
  });
});
