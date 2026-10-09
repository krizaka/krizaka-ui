import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { PageHeader } from "./page-header";

/** The top of a page: `breadcrumb` (a slot), `title` (an h1, or `as="h2"`), `description`, `actions`. */
const meta = {
  title: "Primitives/PageHeader",
  component: PageHeader,
  args: { title: "Payouts", description: "Your earnings are paid every Monday to the account on file." },
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

export const Default: Story = {};

/** With the page's actions. */
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button variant="primary">Withdraw</Button>
      </>
    ),
  },
};

/** With a breadcrumb: the product's own `<nav aria-label>`. */
export const WithBreadcrumb: Story = {
  args: {
    breadcrumb: (
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li>
            <a href="#studio" className="hover:text-fg">
              Studio
            </a>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page">Payouts</li>
        </ol>
      </nav>
    ),
    actions: <Button variant="primary">Withdraw</Button>,
  },
};
