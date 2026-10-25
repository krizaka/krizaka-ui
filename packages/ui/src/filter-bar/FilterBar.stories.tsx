import type { Meta, StoryObj } from "@storybook/react-vite";

import AddressExample from "../../registry/examples/filter-bar/address";
import JobsExample from "../../registry/examples/filter-bar/jobs";
import MenuExample from "../../registry/examples/filter-bar/menu";
import ViewsExample from "../../registry/examples/filter-bar/views";

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
/** The saved views (#627): chips with counts and a « modified » mark on a wide screen; one menu on a phone. */
export const Views: Story = { render: () => <ViewsExample /> };
export const ViewsPhone: Story = { render: () => <ViewsExample />, parameters: { phone: true } };
