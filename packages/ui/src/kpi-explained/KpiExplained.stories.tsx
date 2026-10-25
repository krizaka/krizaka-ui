import type { Meta, StoryObj } from "@storybook/react-vite";

import FounderCockpitExample from "../../registry/examples/kpi-explained/founder-cockpit";
import SalonMonthExample from "../../registry/examples/kpi-explained/salon-month";
import { KpiExplained } from "./kpi-explained";

const meta = {
  title: "Blocks/KpiExplained",
  component: KpiExplained,
} satisfies Meta<typeof KpiExplained>;
export default meta;

type Story = StoryObj;

export const SalonMonth: Story = { render: () => <SalonMonthExample />, parameters: { phone: true } };
export const FounderCockpit: Story = { render: () => <FounderCockpitExample />, parameters: { phone: true } };
