import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/switch/native/default";
import SettingsExample from "../../registry/examples/switch/native/settings";
import { nativeFrame } from "./story-frame";

/**
 * Native — Switch through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/switch/native/*`): the code ui.krizaka.com shows, with these screenshots.
 */
const meta = {
  title: "Native/Switch",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Settings: Story = { render: () => <SettingsExample /> };
export const Default: Story = { render: () => <DefaultExample /> };
