import type { Meta, StoryObj } from "@storybook/react-vite";

import CliExample from "../../registry/examples/docs-article-page/cli";
import FaqExample from "../../registry/examples/docs-article-page/faq";
import { DocsArticlePage } from "./docs-article-page";

/** Docs article page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/DocsArticlePage",
  component: DocsArticlePage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DocsArticlePage>;
export default meta;

type Story = StoryObj;

export const Cli: Story = { render: () => <CliExample /> };
/** On a phone (390 × 844). */
export const CliPhone: Story = { render: () => <CliExample />, parameters: { phone: true } };
export const Faq: Story = { render: () => <FaqExample /> };
/** On a phone (390 × 844). */
export const FaqPhone: Story = { render: () => <FaqExample />, parameters: { phone: true } };
