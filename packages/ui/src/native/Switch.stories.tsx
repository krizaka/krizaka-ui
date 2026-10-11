import type { Meta, StoryObj } from "@storybook/react-vite";

import SettingsExample from "../../registry/examples/switch/native/settings";
import { nativeFrame } from "./story-frame";

/**
 * Native — Switch. Each story renders a named example of the registry (`registry/examples/switch/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Switch", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Settings: Story = { render: () => <SettingsExample /> };
