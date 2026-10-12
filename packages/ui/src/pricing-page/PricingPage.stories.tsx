import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsExample from "../../registry/examples/pricing-page/credits";
import { PricingPage } from "./pricing-page";

/** Pricing page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/PricingPage",
  component: PricingPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PricingPage>;
export default meta;

type Story = StoryObj;

export const Credits: Story = { render: () => <CreditsExample /> };
/** On a phone (390 × 844). */
export const CreditsPhone: Story = { render: () => <CreditsExample />, parameters: { phone: true } };
