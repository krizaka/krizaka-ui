// The product-branded waits: Loader `product`, BrandedRefresh (the mark as the pull) and SplashHandoff (the splash that dissolves).
import { describe, expect, jest, test } from "@jest/globals";
import { act, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, RefreshControl, ScrollView } from "react-native";

import { Loader } from "./loader";
import { BrandedRefresh, pullProgress } from "./pull-to-refresh";
import { SplashHandoff } from "./splash-handoff";

describe("branded waits (native)", () => {
  test("Loader carries the product's mark while it waits, and the check when it ends", async () => {
    jest.useFakeTimers();
    const { rerender } = await render(<Loader label="Loading your videos" product="yomizaka" />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByRole("progressbar", { name: "Loading your videos" })).toBeTruthy();
    // The mark is decorative: the loader's words name the wait.
    expect(screen.queryByRole("image")).toBeNull();
    await rerender(<Loader label="Loading your videos" product="yomizaka" status="success" successLabel="Videos loaded" />);
    await act(async () => jest.advanceTimersByTime(700));
    await act(async () => jest.advanceTimersByTime(10));
    expect(screen.getByLabelText("Videos loaded")).toBeTruthy();
    jest.useRealTimers();
  });

  test("pullProgress goes from 0 at rest to 1 at the threshold, and ignores a push", () => {
    expect(pullProgress(0, 72)).toBe(0);
    expect(pullProgress(-36, 72)).toBe(0.5);
    expect(pullProgress(-200, 72)).toBe(1);
    expect(pullProgress(40, 72)).toBe(0);
  });

  test("BrandedRefresh hands the scrollable its refresh control, announces the refresh and draws the mark", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    announce.mockClear();
    const onRefresh = jest.fn();
    const { rerender } = await render(
      <BrandedRefresh product="yomizaka" refreshing={false} onRefresh={onRefresh} label="Refreshing your videos">
        {(scroll) => <ScrollView testID="list" {...scroll} />}
      </BrandedRefresh>,
    );
    expect(announce).not.toHaveBeenCalled();
    const list = screen.getByTestId("list");
    const control = list.props.refreshControl;
    expect(control.type).toBe(RefreshControl);
    control.props.onRefresh();
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(list.props.scrollEventThrottle).toBe(16);
    await rerender(
      <BrandedRefresh product="yomizaka" refreshing onRefresh={onRefresh} label="Refreshing your videos">
        {(scroll) => <ScrollView testID="list" {...scroll} />}
      </BrandedRefresh>,
    );
    expect(announce).toHaveBeenCalledWith("Refreshing your videos");
  });

  test("SplashHandoff holds the screen with the mark, says it is opening, and leaves once ready", async () => {
    jest.useFakeTimers();
    const onShown = jest.fn();
    const onDone = jest.fn();
    const { rerender } = await render(<SplashHandoff product="yomizaka" ready={false} label="Yomizaka is opening" onShown={onShown} onDone={onDone} />);
    const splash = screen.getByRole("progressbar", { name: "Yomizaka is opening" });
    expect(splash).toBeTruthy();
    await act(async () => splash.props.onLayout?.({ nativeEvent: { layout: { width: 360, height: 640, x: 0, y: 0 } } }));
    expect(onShown).toHaveBeenCalledTimes(1);
    await rerender(<SplashHandoff product="yomizaka" ready label="Yomizaka is opening" onShown={onShown} onDone={onDone} />);
    await act(async () => jest.advanceTimersByTime(600));
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("progressbar", { name: "Yomizaka is opening" })).toBeNull();
    jest.useRealTimers();
  });
});
