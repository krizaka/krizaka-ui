import type { Meta, StoryObj } from "@storybook/react-vite";

import ExposureExample from "../../registry/examples/slider/native/exposure";
import { nativeFrame } from "./story-frame";

/**
 * Native — Slider. Each story renders a named example of the registry (`registry/examples/slider/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Slider", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Exposure: Story = { render: () => <ExposureExample /> };
