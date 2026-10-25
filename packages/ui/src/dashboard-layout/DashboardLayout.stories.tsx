import type { Meta, StoryObj } from "@storybook/react-vite";

import OrazakaEricExample from "../../registry/examples/dashboard-layout/orazaka-eric";
import TodayExample from "../../registry/examples/dashboard-layout/today";
import WidgetsExample from "../../registry/examples/dashboard-layout/widgets";
import { DashboardLayout } from "./dashboard-layout";

/** Dashboard layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/DashboardLayout",
  component: DashboardLayout,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DashboardLayout>;
export default meta;

type Story = StoryObj;

export const OrazakaEric: Story = { render: () => <OrazakaEricExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const OrazakaEricPhone: Story = { render: () => <OrazakaEricExample />, parameters: { phone: true } };
export const Widgets: Story = { render: () => <WidgetsExample /> };
export const Today: Story = { render: () => <TodayExample /> };
/** On a phone (390 × 844): the date under the title, the tiles two by two, the side column last. */
export const TodayPhone: Story = { render: () => <TodayExample />, parameters: { phone: true } };
