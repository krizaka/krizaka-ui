import type { Meta, StoryObj } from "@storybook/react-vite";

import FactsExample from "../../registry/examples/specimen-tag/facts";
import ProductExample from "../../registry/examples/specimen-tag/product";
import StampsExample from "../../registry/examples/specimen-tag/stamps";
import WireExample from "../../registry/examples/specimen-tag/wire";
import { SpecimenTag } from "./specimen-tag";

/** SpecimenTag — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/SpecimenTag",
  component: SpecimenTag,
} satisfies Meta<typeof SpecimenTag>;
export default meta;

type Story = StoryObj;

export const Product: Story = { render: () => <ProductExample /> };
export const Wire: Story = { render: () => <WireExample /> };
export const Stamps: Story = { render: () => <StampsExample /> };
export const Facts: Story = { render: () => <FactsExample /> };
