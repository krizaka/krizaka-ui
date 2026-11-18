import type { Meta, StoryObj } from "@storybook/react-vite";

import ArticleExample from "../../registry/examples/docs-source/article";

/** Docs source — a folder of Markdown files read into the docs frame. Each story renders a named example. */
const meta = {
  title: "Templates/DocsSource",
  component: ArticleExample,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArticleExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Article: Story = {};
/** On a phone (390 × 844). */
export const ArticlePhone: Story = { parameters: { phone: true } };
