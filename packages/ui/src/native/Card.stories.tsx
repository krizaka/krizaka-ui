import type { Meta, StoryObj } from "@storybook/react-vite";

import BodyExample from "../../registry/examples/card/native/body";
import DefaultExample from "../../registry/examples/card/native/default";
import ElevatedExample from "../../registry/examples/card/native/elevated";
import PressableExample from "../../registry/examples/card/native/pressable";
import { Card } from "./card";
import { nativeFrame } from "./story-frame";

/**
 * Native — `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer` on View, Image and Text.
 * Each story renders a named example of the registry (`registry/examples/card/native/*`).
 */
const meta = {
  title: "Native/Card",
  component: Card.Root,
  decorators: [nativeFrame],
} satisfies Meta<typeof Card.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Elevated: Story = { render: () => <ElevatedExample /> };
export const Pressable: Story = { render: () => <PressableExample /> };
export const Body: Story = { render: () => <BodyExample /> };
