import type { Meta, StoryObj } from "@storybook/react-vite";

import CardExample from "../../registry/examples/waveform/native/card";
import { nativeFrame } from "./story-frame";

/** Native — the bars of a sound, decorative by default, breathing while it plays. Each story renders a named example of the registry. */
const meta = { title: "Native/Waveform", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Card: Story = { render: () => <CardExample /> };
