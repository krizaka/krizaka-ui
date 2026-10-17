import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/maintenance-screen/native/default";
import { nativeFrame } from "./story-frame";

/** Native — MaintenanceScreen. The story renders the named example of the registry (`registry/examples/maintenance-screen/native/default`). */
const meta = { title: "Native/MaintenanceScreen", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
