import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/splash-handoff/native/default";
import { nativeFrame } from "./story-frame";

/** Native — SplashHandoff. Each story renders a named example of the registry (`registry/examples/splash-handoff/native/*`). */
const meta = { title: "Native/SplashHandoff", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
