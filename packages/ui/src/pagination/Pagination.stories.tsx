import type { Meta, StoryObj } from "@storybook/react-vite";

import CursorExample from "../../registry/examples/pagination/cursor";
import LinksExample from "../../registry/examples/pagination/links";
import ResultsExample from "../../registry/examples/pagination/results";
import TableFooterExample from "../../registry/examples/pagination/table-footer";

/**
 * Pagination: each story renders a named example of the registry (`registry/examples/pagination/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/Pagination",
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

export const Results: Story = { render: () => <ResultsExample /> };
export const TableFooter: Story = { render: () => <TableFooterExample /> };
export const Cursor: Story = { render: () => <CursorExample /> };
export const Links: Story = { render: () => <LinksExample /> };
