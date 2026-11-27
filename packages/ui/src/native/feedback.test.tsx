// The feedback of /native that Sovkora's Jobs tab waits for: Loader (delayed, announced, ending in words), Stepper (each
// step's status read), Meter (a meter with its value in words), NumberTicker (the final value read from the first frame).
import { describe, expect, jest, test } from "@jest/globals";
import { act, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { Loader } from "./loader";
import { Meter } from "./meter";
import { NumberTicker } from "./number-ticker";
import { Stepper } from "./stepper";

describe("feedback (native)", () => {
  test("Loader shows after its delay, is announced, and ends on its words", async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const { rerender } = await render(<Loader label="Loading your jobs" />);
    expect(screen.queryByLabelText("Loading your jobs")).toBeNull();
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByRole("progressbar", { name: "Loading your jobs" })).toBeTruthy();
    expect(announce).toHaveBeenCalledWith("Loading your jobs");
    await rerender(<Loader label="Loading your jobs" status="success" successLabel="Jobs loaded" />);
    await act(async () => jest.advanceTimersByTime(700));
    await act(async () => jest.advanceTimersByTime(10));
    expect(screen.getByLabelText("Jobs loaded")).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(screen.queryByLabelText("Jobs loaded")).toBeNull();
    jest.useRealTimers();
  });

  test("Loader renders determinate detail across overlay, page, and block variants", async () => {
    jest.useFakeTimers();
    const { rerender } = await render(<Loader label="Uploading" variant="overlay" value={0.42} eta="10 s" />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText("42 % · 10 s")).toBeTruthy();
    await rerender(<Loader label="Uploading" variant="page" endDuration={0} status="error" errorLabel="Upload failed" />);
    await act(async () => jest.advanceTimersByTime(700));
    expect(screen.queryByLabelText("Upload failed")).toBeNull();
    const block = await render(<Loader label="Syncing" variant="block" endDuration={Number.POSITIVE_INFINITY} />);
    await act(async () => jest.advanceTimersByTime(300));
    await block.rerender(<Loader label="Syncing" variant="block" status="error" errorLabel="Sync failed" endDuration={Number.POSITIVE_INFINITY} />);
    await act(async () => jest.advanceTimersByTime(700));
    await act(async () => jest.advanceTimersByTime(10));
    expect(screen.getByLabelText("Sync failed")).toBeTruthy();
    jest.useRealTimers();
  });

  test("Stepper says each step's status; Meter is a meter with its value in words", async () => {
    await render(<Stepper current={1} steps={[{ title: "Transcribe" }, { title: "Translate" }, { title: "Mix" }]} statusLabels={{ done: "fait" }} />);
    expect(screen.getByLabelText("Transcribe, fait")).toBeTruthy();
    expect(screen.getByLabelText("Translate, in progress")).toBeTruthy();
    expect(screen.getByLabelText("Mix, to come")).toBeTruthy();
    await render(<Meter label="Credits" value={4120} max={5000} valueText="4,120 of 5,000" thresholds={{ low: 0.8, high: 0.95 }} />);
    const meter = screen.getByRole("meter" as never);
    expect(meter.props["aria-valuetext"]).toBe("4,120 of 5,000");
    expect(meter.props["aria-valuenow"]).toBe(4120);
  });

  test("NumberTicker carries its final value for screen readers from the first frame", async () => {
    await render(<NumberTicker value={128.4} locale="en-US" format={{ style: "currency", currency: "USD" }} />);
    expect(screen.getByLabelText("$128.40")).toBeTruthy();
  });
});
