import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/slider/native/default";
import RangeExample from "../../registry/examples/slider/native/range";
import SteppedExample from "../../registry/examples/slider/native/stepped";
import VerticalExample from "../../registry/examples/slider/native/vertical";
import { nativeFrame } from "./story-frame";

/**
 * Native — Slider through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/slider/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/Slider",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Stepped: Story = { render: () => <SteppedExample /> };
export const Range: Story = { render: () => <RangeExample /> };
export const Vertical: Story = { render: () => <VerticalExample /> };
