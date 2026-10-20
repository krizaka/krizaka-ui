import type { Meta, StoryObj } from "@storybook/react-vite";

import DocsExample from "../../registry/examples/page-index/docs";
import { PageIndex } from "./page-index";

/** PageIndex — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/PageIndex",
  component: PageIndex,
} satisfies Meta<typeof PageIndex>;
export default meta;

type Story = StoryObj;

export const Docs: Story = { render: () => <DocsExample /> };
