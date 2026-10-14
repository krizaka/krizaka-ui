import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsExample from "../../registry/examples/meter/native/credits";
import SplitRingExample from "../../registry/examples/meter/native/split-ring";
import { nativeFrame } from "./story-frame";

/**
 * Native — Meter. Each story renders a named example of the registry (`registry/examples/meter/native/*`): the code
 * ui.krizaka.com shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Meter", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Credits: Story = { render: () => <CreditsExample /> };
export const SplitRing: Story = { render: () => <SplitRingExample /> };
