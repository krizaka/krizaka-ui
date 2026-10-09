import { act, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Countdown, countdownParts, splitDuration } from "./index";

const units = { d: "d", h: "h", m: "m", s: "s" };
const NOW = new Date("2026-10-09T12:00:00Z").getTime();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => vi.useRealTimers());

describe("splitDuration", () => {
  it("splits milliseconds into d h m s, never negative", () => {
    expect(splitDuration(((2 * 24 + 4) * 3600 + 13 * 60 + 9) * 1000 + 999)).toEqual({ d: 2, h: 4, m: 13, s: 9 });
    expect(splitDuration(-5000)).toEqual({ d: 0, h: 0, m: 0, s: 0 });
  });

  it("shows days only when there are some", () => {
    expect(countdownParts(90_061_000, units).map(([, u]) => u)).toEqual(["d", "h", "m"]);
    expect(countdownParts(3_661_000, units).map(([, u]) => u)).toEqual(["h", "m", "s"]);
  });
});

describe("Countdown", () => {
  it("renders a named timer in segments, with no axe violation", async () => {
    const { container } = render(<Countdown target={NOW + 3_723_000} units={units} label="Ends in" />);
    const timer = screen.getByRole("timer", { name: "Ends in" });
    expect(timer.textContent).toBe("01h02m03s");
    expect(timer.hasAttribute("data-urgent")).toBe(false);
    vi.useRealTimers();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("ticks every second and turns urgent under urgentBelowMs, then ends", () => {
    render(<Countdown target={NOW + 3000} units={units} label="Ends in" urgentBelowMs={10_000} />);
    const timer = screen.getByRole("timer");
    expect(timer.hasAttribute("data-urgent")).toBe(true);
    expect(timer.className).toContain("text-danger");
    act(() => vi.advanceTimersByTime(1000));
    expect(timer.textContent).toBe("00h00m02s");
    act(() => vi.advanceTimersByTime(3000));
    expect(timer.hasAttribute("data-ended")).toBe(true);
    expect(timer.hasAttribute("data-urgent")).toBe(false);
  });

  it("corrects the clock with skewMs", () => {
    render(<Countdown target={NOW + 60_000} skewMs={30_000} units={units} label="Ends in" urgentBelowMs={0} />);
    expect(screen.getByRole("timer").textContent).toBe("00h00m30s");
  });

  it("lets the product's className win", () => {
    render(<Countdown target={NOW + 3_600_000} units={units} label="Ends in" size="sm" className="text-2xl text-accent" />);
    const classes = screen.getByRole("timer").className.split(" ");
    expect(classes).toContain("text-2xl");
    expect(classes).not.toContain("text-sm");
    expect(classes).toContain("text-accent");
    expect(classes).not.toContain("text-fg");
  });
});
