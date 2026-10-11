import type { Meta, StoryObj } from "@storybook/react-vite";

import DiscussExample from "../../registry/examples/cta-panel/discuss";
import { CtaPanel } from "./cta-panel";

/** Call-to-action panel — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/CtaPanel",
  component: CtaPanel,
} satisfies Meta<typeof CtaPanel>;
export default meta;

type Story = StoryObj;

export const Discuss: Story = { render: () => <DiscussExample /> };
