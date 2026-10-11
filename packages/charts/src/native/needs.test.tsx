// The ready-made charts of React Native: the key figure first, in words; the chart under it named by the title.
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

import MonthlyCredits from "../../registry/examples/credit-usage/native/monthly-credits";
import CreatorMonth from "../../registry/examples/earnings-chart/native/creator-month";
import ChallengePot from "../../registry/examples/goal-progress/native/challenge-pot";
import WeekOfJobs from "../../registry/examples/job-throughput/native/week-of-jobs";
import ByCapability from "../../registry/examples/latency-chart/native/by-capability";
import AuctionRoom from "../../registry/examples/price-ticker/native/auction-room";

describe("native ready-made charts", () => {
  it("lead with the key figure and keep the chart named by the title", async () => {
    await render(<CreatorMonth />);
    expect(screen.getByRole("heading", { name: "Your earnings" })).toBeTruthy();
    expect(screen.getByText("$1,990.40")).toBeTruthy();
    expect(screen.getByText("+16% vs September")).toBeTruthy();
    expect(screen.getByRole("adjustable").props.accessibilityLabel).toMatch(/^Your earnings\. Bar chart/);
  });

  it("say the success rate, the slowest p95 and the current bid", async () => {
    await render(<WeekOfJobs />);
    expect(screen.getByText("97.5% succeeded")).toBeTruthy();
    await render(<ByCapability />);
    expect(screen.getByText("p95 of Image, the slowest")).toBeTruthy();
    expect(screen.getByText("2 over the objective")).toBeTruthy();
    await render(<AuctionRoom />);
    expect(screen.getByText("$72.00")).toBeTruthy();
    expect(screen.getByText("+$52.00 (+260%) since the opening · 6 bids")).toBeTruthy();
  });

  it("CreditUsage: a meter in words and the run-out date; GoalProgress: the facts under the gauge", async () => {
    await render(<MonthlyCredits />);
    expect(screen.getByRole("meter").props["aria-valuetext"]).toBe("3,120 used (62.4%)");
    expect(screen.getByText("At this pace, runs out on Oct 19, 2026")).toBeTruthy();
    await render(<ChallengePot />);
    expect(screen.getByText("41 supporters · 3 days left")).toBeTruthy();
  });
});
