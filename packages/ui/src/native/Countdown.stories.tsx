import type { Meta, StoryObj } from "@storybook/react-vite";

import DaysExample from "../../registry/examples/countdown/native/days";
import HoursExample from "../../registry/examples/countdown/native/hours";
import SizesExample from "../../registry/examples/countdown/native/sizes";
import UrgentExample from "../../registry/examples/countdown/native/urgent";
import { Countdown } from "./countdown";
import { nativeFrame } from "./story-frame";

// The clock is frozen for the stories, so the screenshots are stable.
const NOW = Date.UTC(2026, 9, 9, 12, 0, 0);

/**
 * Native — time left, on the same clock as the web `Countdown`. The clock is frozen here (`Date.now`).
 * Each story renders a named example of the registry (`registry/examples/countdown/native/*`).
 */
const meta = {
  title: "Native/Countdown",
  component: Countdown,
  decorators: [nativeFrame],
  args: { target: NOW + 3_723_000, units: { d: "d", h: "h", m: "m", s: "s" }, label: "Ends in" },
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

export const Hours: Story = { render: () => <HoursExample /> };
export const Days: Story = { render: () => <DaysExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
export const Urgent: Story = { render: () => <UrgentExample /> };
