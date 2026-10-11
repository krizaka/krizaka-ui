// The ready-made charts: their arithmetic (totals, changes, success rate, run-out date, durations, the auction's
// steps) and what they write on the server — the key figure in words, the formats chosen for the need — with no axe
// violation once drawn.
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import MonthlyCredits from "../../registry/examples/credit-usage/monthly-credits";
import StoragePlan from "../../registry/examples/credit-usage/storage-plan";
import CreatorMonth from "../../registry/examples/earnings-chart/creator-month";
import GoalReached from "../../registry/examples/goal-progress/goal-reached";
import WeekOfJobs from "../../registry/examples/job-throughput/week-of-jobs";
import ByCapability from "../../registry/examples/latency-chart/by-capability";
import TimeToResult from "../../registry/examples/latency-chart/time-to-result";
import AuctionRoom from "../../registry/examples/price-ticker/auction-room";
import NoBidYet from "../../registry/examples/price-ticker/no-bid-yet";
import { axeViolations } from "../test/axe";
import { mockWidth } from "../test/setup";
import { daysLeft, direction, formatDuration, lastChange, quotaLevel, signedPercent, successRate } from "./model";
import { tickerModel } from "./ticker";

describe("the arithmetic of the ready-made charts", () => {
  it("compares the last two periods, says the direction and the success rate", () => {
    expect(lastChange([100, 200, 250])).toBeCloseTo(0.25);
    expect(lastChange([100, 0, 250])).toBeNull();
    expect(lastChange([5])).toBeNull();
    expect(direction(0.001)).toBe("flat");
    expect(direction(-0.2)).toBe("down");
    expect(successRate(95, 5)).toBe(0.95);
    expect(successRate(0, 0)).toBeNull();
    expect(signedPercent(0.123, "en-US")).toBe("+12%");
    expect(signedPercent(-0.034, "fr-FR")).toMatch(/^-3,4\s?%$/);
  });

  it("projects the run-out at the pace of the last seven days, and the quota level", () => {
    expect(daysLeft(700, [0, 0, 100, 100, 100, 100, 100, 100, 100])).toBe(7);
    expect(daysLeft(700, [0, 0, 0])).toBeNull();
    expect(daysLeft(700, [])).toBeNull();
    expect(quotaLevel(0.5)).toBe("ok");
    expect(quotaLevel(0.85)).toBe("warning");
    expect(quotaLevel(0.97)).toBe("danger");
  });

  it("writes a duration in the unit that fits", () => {
    expect(formatDuration(840, "en-US")).toBe("840 ms");
    expect(formatDuration(1_240, "en-US")).toBe("1.2 sec");
    expect(formatDuration(312_000, "en-US")).toBe("5.2 min");
  });

  it("orders the bids after the opening and measures the change", () => {
    const model = tickerModel([{ at: "2026-10-11T18:10:00Z", amount: 30 }, { at: "2026-10-11T18:05:00Z", amount: 25 }], 20, "2026-10-11T18:00:00Z");
    expect(model.points.map((p) => p.amount)).toEqual([20, 25, 30]);
    expect(model).toMatchObject({ current: 30, change: 10, ratio: 0.5, count: 2 });
    expect(tickerModel([], 20)).toMatchObject({ current: 20, count: 0, points: [] });
  });
});

describe("the ready-made charts", () => {
  it("write their key figure on the server, in the need's formats", () => {
    expect(renderToString(<CreatorMonth />)).toMatch(/\$1,990\.40.*earned over 6 months.*\+16% vs September/);
    const jobs = renderToString(<WeekOfJobs />);
    expect(jobs).toContain("10,519");
    expect(jobs).toContain("97.5% succeeded");
    expect(renderToString(<ByCapability />)).toMatch(/9\.8 sec.*p95 of Image, the slowest.*2 over the objective/);
    expect(renderToString(<TimeToResult />)).toMatch(/9 min.*median of Video clip, the slowest/);
    expect(renderToString(<AuctionRoom />)).toMatch(/\$72\.00.*current bid.*\+\$52\.00 \(\+260%\) since the opening · 8 bids/);
    expect(renderToString(<NoBidYet />)).toContain("opening price, no bid yet");
  });

  it("CreditUsage: the remaining amount, a meter in words and tones, the run-out date before the renewal", async () => {
    const { container } = render(<MonthlyCredits />);
    expect(screen.getByText("1,880")).toBeTruthy();
    const meter = screen.getByRole("meter", { name: "Credits this month" });
    expect(meter.getAttribute("aria-valuetext")).toBe("3,120 used (62.4%)");
    expect(meter.dataset.tone).toBeUndefined();
    expect(screen.getByText("At this pace, runs out on Oct 19, 2026")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
    render(<StoragePlan />);
    expect(screen.getByRole("meter", { name: "Platform storage" }).dataset.tone).toBe("warning");
  });

  it("GoalProgress: past the goal, the amount keeps counting and the words say it is reached", async () => {
    mockWidth(360);
    const { container } = render(<GoalReached />);
    expect(container.textContent).toContain("128 soutiens · Objectif atteint");
    expect(await axeViolations(container)).toEqual([]);
  });
});
