import type { Meta, StoryObj } from "@storybook/react-vite";

import { Countdown } from "./countdown";

// The clock is frozen for the stories, so the screenshots are stable: every target is relative to NOW.
const NOW = Date.UTC(2026, 9, 9, 12, 0, 0);
const units = { d: "d", h: "h", m: "m", s: "s" };

/**
 * Time left until a moment, in tabular figures; days only when there are some. Under `urgentBelowMs` it turns to the
 * danger role (`data-urgent`) and its last segment pulses. `units` and `label` are the app's words.
 */
const meta = {
  title: "Primitives/Countdown",
  component: Countdown,
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
    <div className="flex flex-col items-start gap-3">
      <Countdown {...args} size="sm" />
      <Countdown {...args} size="md" />
      <Countdown {...args} size="lg" />
    </div>
  ),
};

/** Under a minute: the danger role (large-text safe from `size="md"`). */
export const Urgent: Story = { args: { target: NOW + 42_000 } };

/** Past the target: zeros, `data-ended`. */
export const Ended: Story = { args: { target: NOW - 1000 } };
