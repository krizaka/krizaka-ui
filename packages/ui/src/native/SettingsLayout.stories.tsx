import type { Meta, StoryObj } from "@storybook/react-vite";

import SettingsExample from "../../registry/examples/settings-layout/native/settings";
import { nativeFrame } from "./story-frame";

/** Native — a settings screen: titled groups of rows, a switch, a destructive row. Each story renders a named example of the registry (`registry/examples/settings-layout/native/*`). */
const meta = {
  title: "Native/SettingsLayout",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Settings: Story = { render: () => <SettingsExample /> };
