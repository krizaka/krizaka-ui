import type { Meta, StoryObj } from "@storybook/react-vite";

import CardsExample from "../../registry/examples/data-table/cards";
import DetailsExample from "../../registry/examples/data-table/details";
import EmptyExample from "../../registry/examples/data-table/empty";
import ErrorExample from "../../registry/examples/data-table/error";
import FiltersExample from "../../registry/examples/data-table/filters";
import GroupedExample from "../../registry/examples/data-table/grouped";
import JobsExample from "../../registry/examples/data-table/jobs";
import LoadingExample from "../../registry/examples/data-table/loading";
import PaginatedExample from "../../registry/examples/data-table/paginated";
import PinnedExample from "../../registry/examples/data-table/pinned";
import ServerExample from "../../registry/examples/data-table/server";
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
export const Filters: Story = { render: () => <FiltersExample /> };
/** Sort, filters and page answered by a fake API through @krizaka/query (`krizakaFetch`, `defineKeys`). */
export const Server: Story = { render: () => <ServerExample /> };
export const Paginated: Story = { render: () => <PaginatedExample /> };
export const Grouped: Story = { render: () => <GroupedExample /> };
export const Details: Story = { render: () => <DetailsExample /> };
export const Pinned: Story = { render: () => <PinnedExample /> };
export const Cards: Story = { render: () => <CardsExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
export const Empty: Story = { render: () => <EmptyExample /> };
export const Error: Story = { render: () => <ErrorExample /> };
/** 50,000 rows. */
export const Virtualized: Story = { render: () => <VirtualizedExample /> };
