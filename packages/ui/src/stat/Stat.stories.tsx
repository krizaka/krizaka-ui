import type { Meta, StoryObj } from "@storybook/react-vite";

import DownExample from "../../registry/examples/stat/down";
import FlatExample from "../../registry/examples/stat/flat";
import PlainExample from "../../registry/examples/stat/plain";
import RowExample from "../../registry/examples/stat/row";
import UpExample from "../../registry/examples/stat/up";
import { Stat } from "./stat";

/**
 * A key figure: `label`, `value` (tabular digits), `hint`, `trend` with `trendLabel` — the change in words.
 * Each story renders a named example of the registry (`registry/examples/stat/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Stat",
  component: Stat,
  args: { label: "Revenue", value: "€4,812" },
} satisfies Meta<typeof Stat>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Up: Story = { render: () => <UpExample /> };
export const Down: Story = { render: () => <DownExample /> };
export const Flat: Story = { render: () => <FlatExample /> };
export const Plain: Story = { render: () => <PlainExample /> };
export const Row: Story = { render: () => <RowExample /> };
