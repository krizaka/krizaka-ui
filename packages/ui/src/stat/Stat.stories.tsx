import type { Meta, StoryObj } from "@storybook/react-vite";

import StatDemo from "../../registry/demos/stat";
import { Stat } from "./stat";

/**
 * A key figure: `label`, `value` (tabular digits), `hint`, `trend` up · down · flat with `trendLabel` — the change in
 * words, read and shown; the arrow is decorative and carries the colour.
 */
const meta = {
  title: "Primitives/Stat",
  component: Stat,
  args: { label: "Revenue", value: "€4,812", hint: "vs last month" },
} satisfies Meta<typeof Stat>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The demo of the registry (`registry/demos/stat.tsx`). */
export const Up: Story = { render: () => <StatDemo /> };

export const Down: Story = { args: { trend: "down", trendLabel: "−4 %" } };

export const Flat: Story = { args: { trend: "flat", trendLabel: "0 %" } };

/** Label and value only. */
export const Plain: Story = { args: { hint: undefined } };

/** A row of stats, as a dashboard shows them. */
export const Row: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 rounded-xl border border-border-default bg-surface-1 p-6">
      <Stat label="Views" value="12.4k" trend="up" trendLabel="+8 %" hint="7 days" />
      <Stat label="Supporters" value="318" trend="up" trendLabel="+21" hint="7 days" />
      <Stat label="Payouts" value="€902" trend="down" trendLabel="−3 %" hint="7 days" />
    </div>
  ),
};
