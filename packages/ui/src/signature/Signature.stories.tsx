import type { Meta, StoryObj } from "@storybook/react-vite";

import BothExample from "../../registry/examples/signature/both";
import VariantsExample from "../../registry/examples/signature/variants";
import { Signature } from "./signature";

/** Signature — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/Signature",
  component: Signature,
} satisfies Meta<typeof Signature>;
export default meta;

type Story = StoryObj;

export const Both: Story = { render: () => <BothExample /> };
export const Variants: Story = { render: () => <VariantsExample /> };
