import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/notification-preferences/default";

/** Notification preferences. Each story renders a named example of the registry. */
const meta = { title: "Forms/NotificationPreferences", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const DefaultPhone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
