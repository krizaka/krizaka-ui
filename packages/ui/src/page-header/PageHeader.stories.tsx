import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/page-header/default";
import WithActionsExample from "../../registry/examples/page-header/with-actions";
import WithBreadcrumbExample from "../../registry/examples/page-header/with-breadcrumb";
import { PageHeader } from "./page-header";

/**
 * The top of a page: `breadcrumb` (a slot), `title` (an h1, or `as="h2"`), `description`, `actions`.
 * Each story renders a named example of the registry (`registry/examples/page-header/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/PageHeader",
  component: PageHeader,
  args: { title: "Payouts" },
  decorators: [
    (Story) => (
      <div className="w-[42rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const WithActions: Story = { render: () => <WithActionsExample /> };
export const WithBreadcrumb: Story = { render: () => <WithBreadcrumbExample /> };
