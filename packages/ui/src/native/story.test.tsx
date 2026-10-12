// The native storytelling kit: ProfileCard, GoalGauge and the Phoenix.
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { GoalGauge } from "./goal-gauge";
import { Phoenix } from "./phoenix";
import { ProfileCard } from "./profile-card";

describe("ProfileCard", () => {
  test("says the name, and each gauge is a meter with its value in words", async () => {
    await render(
      <ProfileCard
        visual={<Text>EM</Text>}
        name="Elena"
        statLabel="Profile complete"
        value={80}
        stats={[{ label: "Challenges met", value: 12, max: 15, valueText: "12 of 15" }]}
        caption="Montréal"
        animated={false}
      />,
    );
    expect(screen.getByText("Elena")).toBeOnTheScreen();
    expect(screen.getByText("Montréal")).toBeOnTheScreen();
    expect(screen.getByRole("meter", { name: "Profile complete" }).props["aria-valuetext"]).toBe("80 %");
    expect(screen.getByRole("meter", { name: "Challenges met" }).props["aria-valuetext"]).toBe("12 of 15");
  });
});

describe("GoalGauge", () => {
  test("is a meter counted in steps", async () => {
    await render(<GoalGauge label="Backers" segments={10} value={6} valueText="6 of 10 backers" animated={false} />);
    const meter = screen.getByRole("meter", { name: "Backers" });
    expect(meter.props["aria-valuenow"]).toBe(6);
    expect(meter.props["aria-valuemax"]).toBe(10);
    expect(meter.props["aria-valuetext"]).toBe("6 of 10 backers");
  });

  test("draws the arcade flavour and drains", async () => {
    await render(<GoalGauge label="Problems" segments={8} value={0} mode="drain" variant="arcade" animated={false} />);
    expect(screen.getByRole("meter", { name: "Problems" }).props["aria-valuenow"]).toBe(0);
  });
});

describe("Phoenix", () => {
  test("is an image with a title, hidden without one", async () => {
    await render(<Phoenix title="The phoenix" tone="brand" animated={false} />);
    expect(screen.getByRole("image", { name: "The phoenix" })).toBeOnTheScreen();
    await render(<Phoenix animated={false} />);
    expect(screen.queryByRole("image")).toBeNull();
  });
});
