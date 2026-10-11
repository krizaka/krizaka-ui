import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/marketing-layout/basic";
import DocsHubExample from "../../registry/examples/marketing-layout/docs-hub";
import PricingExample from "../../registry/examples/marketing-layout/pricing";
import ProductPageExample from "../../registry/examples/marketing-layout/product-page";
import { MarketingLayout } from "./marketing-layout";

/** Marketing layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/MarketingLayout",
  component: MarketingLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MarketingLayout>;
export default meta;

type Story = StoryObj;

export const ProductPage: Story = { render: () => <ProductPageExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const ProductPagePhone: Story = { render: () => <ProductPageExample />, parameters: { phone: true } };
export const Pricing: Story = { render: () => <PricingExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const PricingPhone: Story = { render: () => <PricingExample />, parameters: { phone: true } };
export const DocsHub: Story = { render: () => <DocsHubExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const DocsHubPhone: Story = { render: () => <DocsHubExample />, parameters: { phone: true } };
export const Basic: Story = { render: () => <BasicExample /> };
