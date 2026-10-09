import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Countdown } from "./countdown";
import { nativeFrame } from "./story-frame";

// The clock is frozen for the stories, so the screenshots are stable: every target is relative to NOW.
const NOW = Date.UTC(2026, 9, 9, 12, 0, 0);
const units = { d: "d", h: "h", m: "m", s: "s" };

/** Native — time left, on the same clock as the web `Countdown`; under `urgentBelowMs`, the danger role. */
const meta = {
  title: "Native/Countdown",
  component: Countdown,
  decorators: [nativeFrame],
  args: { target: NOW + 3_723_000, units, label: "Ends in" },
  beforeEach() {
    const realNow = Date.now;
    Date.now = () => NOW;
    return () => {
      Date.now = realNow;
    };
  },
} satisfies Meta<typeof Countdown>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Hours, minutes, seconds. */
export const Hours: Story = {};

/** Days, hours, minutes. */
export const Days: Story = { args: { target: NOW + ((2 * 24 + 4) * 3600 + 13 * 60) * 1000 } };

/** sm · md · lg. */
export const Sizes: Story = {
  render: (args) => (
    <>
      <Countdown {...args} size="sm" />
      <Countdown {...args} size="md" />
      <Countdown {...args} size="lg" />
    </>
  ),
};

/** Under a minute: the danger role, the last segment breathes (still under reduced motion). */
export const Urgent: Story = { args: { target: NOW + 42_000, size: "lg" } };
