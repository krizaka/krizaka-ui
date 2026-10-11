import type { Meta, StoryObj } from "@storybook/react-vite";

import RunExample from "../../registry/examples/stepper/native/run";
import { nativeFrame } from "./story-frame";

/**
 * Native — Stepper. Each story renders a named example of the registry (`registry/examples/stepper/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Stepper", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Run: Story = { render: () => <RunExample /> };
