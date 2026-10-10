import type { Meta, StoryObj } from "@storybook/react-vite";

import AsChildLinkExample from "../../registry/examples/button/as-child-link";
import DangerExample from "../../registry/examples/button/danger";
import DisabledExample from "../../registry/examples/button/disabled";
import GhostExample from "../../registry/examples/button/ghost";
import IconExample from "../../registry/examples/button/icon";
import LoadingExample from "../../registry/examples/button/loading";
import OutlineExample from "../../registry/examples/button/outline";
import PillExample from "../../registry/examples/button/pill";
import PrimaryExample from "../../registry/examples/button/primary";
import SecondaryExample from "../../registry/examples/button/secondary";
import SizesExample from "../../registry/examples/button/sizes";
import { Button } from "./button";

/**
 * The action. `variant` × `size` × `shape`, `loading`, `asChild`; `buttonVariants` styles a link without the component.
 * Each story renders a named example of the registry (`registry/examples/button/*`, listed in `meta.ts`): the code
 * krizaka.com/docs/ui shows and gives to copy.
 */
const meta = {
  title: "Primitives/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { render: () => <PrimaryExample /> };
export const Secondary: Story = { render: () => <SecondaryExample /> };
export const Outline: Story = { render: () => <OutlineExample /> };
export const Ghost: Story = { render: () => <GhostExample /> };
export const Danger: Story = { render: () => <DangerExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
export const Pill: Story = { render: () => <PillExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
export const AsChildLink: Story = { render: () => <AsChildLinkExample /> };
export const Icon: Story = { render: () => <IconExample /> };
