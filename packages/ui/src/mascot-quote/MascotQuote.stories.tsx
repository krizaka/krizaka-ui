import type { Meta, StoryObj } from "@storybook/react-vite";

import CalloutExample from "../../registry/examples/mascot-quote/callout";
import InlineExample from "../../registry/examples/mascot-quote/inline";
import { MascotQuote } from "./mascot-quote";

/** Mascot quote — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/MascotQuote",
  component: MascotQuote,
} satisfies Meta<typeof MascotQuote>;
export default meta;

type Story = StoryObj;

export const Inline: Story = { render: () => <InlineExample /> };
export const Callout: Story = { render: () => <CalloutExample /> };
