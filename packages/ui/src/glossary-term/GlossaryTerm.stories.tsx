import type { Meta, StoryObj } from "@storybook/react-vite";

import InlineExample from "../../registry/examples/glossary-term/inline";
import { GlossaryTerm } from "./glossary-term";

const meta = {
  title: "Blocks/GlossaryTerm",
  component: GlossaryTerm,
} satisfies Meta<typeof GlossaryTerm>;
export default meta;

type Story = StoryObj;

export const Inline: Story = { render: () => <InlineExample />, parameters: { phone: true } };
