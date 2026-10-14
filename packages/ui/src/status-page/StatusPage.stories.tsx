import type { Meta, StoryObj } from "@storybook/react-vite";

import BuildingExample from "../../registry/examples/status-page/building";
import MaintenanceExample from "../../registry/examples/status-page/maintenance";
import OperationalExample from "../../registry/examples/status-page/operational";
import { StatusPage } from "./status-page";

/** Status page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/StatusPage",
  component: StatusPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StatusPage>;
export default meta;

type Story = StoryObj;

export const Operational: Story = { render: () => <OperationalExample /> };
/** On a phone (390 × 844). */
export const OperationalPhone: Story = { render: () => <OperationalExample />, parameters: { phone: true } };
export const Building: Story = { render: () => <BuildingExample /> };
/** On a phone (390 × 844). */
export const BuildingPhone: Story = { render: () => <BuildingExample />, parameters: { phone: true } };
export const Maintenance: Story = { render: () => <MaintenanceExample /> };
/** On a phone (390 × 844). */
export const MaintenancePhone: Story = { render: () => <MaintenanceExample />, parameters: { phone: true } };
