import type { Meta, StoryObj } from "@storybook/react-vite";

import CardExample from "../../registry/examples/waveform/card";
import SizesExample from "../../registry/examples/waveform/sizes";

/** Waveform. Each story renders a named example of the registry (`registry/examples/waveform/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/Waveform" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Card: Story = { render: () => <CardExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
