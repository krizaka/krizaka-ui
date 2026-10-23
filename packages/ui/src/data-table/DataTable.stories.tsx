import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import CardsExample from "../../registry/examples/data-table/cards";
import CatalogueExample from "../../registry/examples/data-table/catalogue";
import DetailsExample from "../../registry/examples/data-table/details";
import EmptyExample from "../../registry/examples/data-table/empty";
import ErrorExample from "../../registry/examples/data-table/error";
import FiltersExample from "../../registry/examples/data-table/filters";
import GroupedExample from "../../registry/examples/data-table/grouped";
import InvoicesExample from "../../registry/examples/data-table/invoices";
import JobsExample from "../../registry/examples/data-table/jobs";
import LoadingExample from "../../registry/examples/data-table/loading";
import PaginatedExample from "../../registry/examples/data-table/paginated";
import PinnedExample from "../../registry/examples/data-table/pinned";
import RunsExample from "../../registry/examples/data-table/runs";
import ServerExample from "../../registry/examples/data-table/server";
import VirtualizedExample from "../../registry/examples/data-table/virtualized";
import { Badge } from "../badge";
import { DataTable, type DataTableColumn } from "./index";

/**
 * DataTable: each story renders a named example of the registry (`registry/examples/data-table/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/DataTable",
  decorators: [
    (Story, { parameters }) => (
      <div style={{ width: (parameters.width as string | undefined) ?? "40rem", maxWidth: "100%" }}>
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

/** The models catalogue at a desktop's content width: eight columns in the row. */
export const Catalogue: Story = { render: () => <CatalogueExample />, parameters: { width: "72rem" } };
/** The same table at a laptop's: the licence, context and date go to the row's detail. */
export const CatalogueMedium: Story = { render: () => <CatalogueExample />, parameters: { width: "56rem" } };
/** On a phone: each row a card; priority 2 stays on its face, the rest behind the chevron. */
export const CatalogueNarrow: Story = { render: () => <CatalogueExample />, parameters: { width: "22rem" } };
export const Invoices: Story = { render: () => <InvoicesExample />, parameters: { width: "60rem" } };
export const InvoicesNarrow: Story = { render: () => <InvoicesExample />, parameters: { width: "22rem" } };
export const Runs: Story = { render: () => <RunsExample />, parameters: { width: "64rem" } };
export const RunsNarrow: Story = { render: () => <RunsExample />, parameters: { width: "22rem" } };

type Person = { id: string; name: string; email: string; status: string };
const people: Person[] = [
  { id: "1", name: "Alexandra", email: "alexandra.longname@very-long-company-domain.example", status: "Awaiting the manager's approval for the requested publication" },
];
const peopleColumns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", card: "title" },
  { id: "email", header: "E-mail" },
  { id: "status", header: "Status", cell: (person) => <Badge tone="warning" size="md" dot>{person.status}</Badge> },
];
/** At 360 px a card never scrolls sideways: a 40-character e-mail and a long status wrap. */
export const CardsWrapLongValues: Story = {
  render: () => <DataTable caption="People" rows={people} columns={peopleColumns} getRowId={(r) => r.id} layout="cards" />,
  parameters: { width: "360px" },
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector<HTMLElement>('td[data-label="Status"]')!;
    const badge = cell.querySelector<HTMLElement>("[data-tone]")!;
    await expect(badge.getBoundingClientRect().right).toBeLessThanOrEqual(cell.getBoundingClientRect().right + 1);
    await expect(badge.scrollWidth).toBeLessThanOrEqual(badge.clientWidth);
    await expect(getComputedStyle(badge).whiteSpace).toBe("normal");
  },
};

export const AutoWrapLongValues: Story = {
  ...CardsWrapLongValues,
  render: () => <DataTable caption="People" rows={people} columns={peopleColumns} getRowId={(r) => r.id} />,
};
