import type { Meta, StoryObj } from "@storybook/react-vite";

import DaysExample from "../../registry/examples/countdown/days";
import EndedExample from "../../registry/examples/countdown/ended";
import HoursExample from "../../registry/examples/countdown/hours";
import SizesExample from "../../registry/examples/countdown/sizes";
import UrgentExample from "../../registry/examples/countdown/urgent";
import { Countdown } from "./countdown";

// The clock is frozen for the stories, so the screenshots are stable.
const NOW = Date.UTC(2026, 9, 9, 12, 0, 0);

/**
 * Time left until a moment, in tabular figures. The clock is frozen here (`Date.now`), so the screenshots are stable.
 * Each story renders a named example of the registry (`registry/examples/countdown/*`).
 */
const meta = {
  title: "Primitives/Countdown",
  component: Countdown,
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
export const Ended: Story = { render: () => <EndedExample /> };
