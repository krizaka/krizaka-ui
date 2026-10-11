// The native flock: Mascot, MascotState.
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";

import { MASCOT_BIRDS, MASCOT_MOODS } from "../mascots/geometry";
import { ErrorState, SuccessState } from "./mascot-state";
import { Mascot } from "./mascots";

describe("Mascot", () => {
  test("is an image with a title, hidden without one", async () => {
    await render(<Mascot title="Welcome" animated={false} />);
    expect(screen.getByRole("image", { name: "Welcome" })).toBeOnTheScreen();
    await render(<Mascot animated={false} />);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test.each(MASCOT_BIRDS.flatMap((bird) => MASCOT_MOODS.map((mood) => [bird, mood] as const)))("draws the %s %s", async (bird, mood) => {
    await render(<Mascot bird={bird} mood={mood} tone={bird === "owl" ? "own" : "brand"} title={`${bird} ${mood}`} animated={false} />);
    expect(screen.getByRole("image", { name: `${bird} ${mood}` })).toBeOnTheScreen();
  });
});

describe("MascotState", () => {
  test("says its words, an error as an alert", async () => {
    await render(<SuccessState bird="flamingo" animated={false} title="Payment received" description="120 credits." />);
    expect(screen.getByText("Payment received")).toBeOnTheScreen();
    expect(screen.getByText("120 credits.")).toBeOnTheScreen();
    await render(<ErrorState bird="falcon" animated={false} title="Code expired" />);
    type Node = { props: Record<string, unknown>; parent: Node | null };
    let node = screen.getByText("Code expired") as unknown as Node | null;
    while (node && node.props.role !== "alert") node = node.parent;
    expect(node?.props.accessibilityLiveRegion).toBe("assertive");
  });
});
