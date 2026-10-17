import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/maintenance-screen/default";

/** MaintenanceScreen. The story renders the named example of the registry (`registry/examples/maintenance-screen/default`). */
const meta = {
  title: "Primitives/MaintenanceScreen",
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
/** On a phone (390 × 844). */
export const Phone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
