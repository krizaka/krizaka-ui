import type { Meta, StoryObj } from "@storybook/react-vite";

import PageExample from "../../registry/examples/docs-layout/page";
import { DocsLayout } from "./docs-layout";

/** Docs layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/DocsLayout",
  component: DocsLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DocsLayout>;
export default meta;

type Story = StoryObj;

export const Page: Story = { render: () => <PageExample /> };
