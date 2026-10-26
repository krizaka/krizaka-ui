import type { Meta, StoryObj } from "@storybook/react-vite";

import DevelopmentExample from "../../registry/examples/environment-notice/native/development";
import { nativeFrame } from "./story-frame";

/** Native — the « development version » band. Each story renders a named example of the registry. */
const meta = { title: "Native/EnvironmentNotice", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Development: Story = { render: () => <DevelopmentExample /> };
