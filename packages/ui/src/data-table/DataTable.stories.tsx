import type { Meta, StoryObj } from "@storybook/react-vite";

import CardsExample from "../../registry/examples/data-table/cards";
import EmptyExample from "../../registry/examples/data-table/empty";
import ErrorExample from "../../registry/examples/data-table/error";
import JobsExample from "../../registry/examples/data-table/jobs";
import LoadingExample from "../../registry/examples/data-table/loading";
import StickyHeaderExample from "../../registry/examples/data-table/sticky-header";
import VirtualizedExample from "../../registry/examples/data-table/virtualized";

/**
 * DataTable: each story renders a named example of the registry (`registry/examples/data-table/*`) — the code
 * krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/DataTable",
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
export const Cards: Story = { render: () => <CardsExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
export const Empty: Story = { render: () => <EmptyExample /> };
export const Error: Story = { render: () => <ErrorExample /> };
export const Virtualized: Story = { render: () => <VirtualizedExample /> };
export const StickyHeader: Story = { render: () => <StickyHeaderExample /> };
