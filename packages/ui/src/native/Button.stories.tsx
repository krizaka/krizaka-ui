import type { Meta, StoryObj } from "@storybook/react-vite";

import DangerExample from "../../registry/examples/button/native/danger";
import DisabledExample from "../../registry/examples/button/native/disabled";
import GhostExample from "../../registry/examples/button/native/ghost";
import IconExample from "../../registry/examples/button/native/icon";
import IconOnlyExample from "../../registry/examples/button/native/icon-only";
import LoadingExample from "../../registry/examples/button/native/loading";
import OutlineExample from "../../registry/examples/button/native/outline";
import PrimaryExample from "../../registry/examples/button/native/primary";
import SecondaryExample from "../../registry/examples/button/native/secondary";
import SizesExample from "../../registry/examples/button/native/sizes";
import { Button } from "./button";
import { nativeFrame } from "./story-frame";

/**
 * Native — the action: `variant` × `size` × `shape`, `loading`, `icon`. `label` is the text and the accessible name.
 * Each story renders a named example of the registry (`registry/examples/button/native/*`).
 */
const meta = {
  title: "Native/Button",
  component: Button,
  decorators: [nativeFrame],
  args: { label: "Continue" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { render: () => <PrimaryExample /> };
export const Secondary: Story = { render: () => <SecondaryExample /> };
export const Outline: Story = { render: () => <OutlineExample /> };
export const Ghost: Story = { render: () => <GhostExample /> };
export const Danger: Story = { render: () => <DangerExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
export const Icon: Story = { render: () => <IconExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
export const IconOnly: Story = { render: () => <IconOnlyExample /> };
