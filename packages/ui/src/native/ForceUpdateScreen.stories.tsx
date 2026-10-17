import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/force-update-screen/native/default";
import { nativeFrame } from "./story-frame";

/** Native — ForceUpdateScreen. The story renders the named example of the registry (`registry/examples/force-update-screen/native/default`). */
const meta = { title: "Native/ForceUpdateScreen", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
