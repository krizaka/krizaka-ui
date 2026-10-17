import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/maintenance-screen/default";
import { MaintenanceScreen } from "./maintenance-screen";

/** MaintenanceScreen. The story renders the named example of the registry (`registry/examples/maintenance-screen/default`). */
const meta = {
  title: "Primitives/MaintenanceScreen",
  component: MaintenanceScreen,
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MaintenanceScreen>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
/** On a phone (390 × 844). */
export const Phone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
