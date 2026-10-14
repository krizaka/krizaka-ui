import type { Meta, StoryObj } from "@storybook/react-vite";

import AddressExample from "../../registry/examples/filter-bar/address";
import JobsExample from "../../registry/examples/filter-bar/jobs";
import MenuExample from "../../registry/examples/filter-bar/menu";

/**
 * FilterBar: each story renders a named example of the registry (`registry/examples/filter-bar/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/FilterBar",
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Jobs: Story = { render: () => <JobsExample /> };
export const Menu: Story = { render: () => <MenuExample defaultOpen />, parameters: { capture: "viewport" } };
export const Address: Story = { render: () => <AddressExample /> };
