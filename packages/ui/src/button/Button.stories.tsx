import type { Meta, StoryObj } from "@storybook/react-vite";

import AsChildLinkExample from "../../registry/examples/button/as-child-link";
import DangerExample from "../../registry/examples/button/danger";
import DisabledExample from "../../registry/examples/button/disabled";
import FailureExample from "../../registry/examples/button/error";
import GhostExample from "../../registry/examples/button/ghost";
import GradientExample from "../../registry/examples/button/gradient";
import IconExample from "../../registry/examples/button/icon";
import LoadingExample from "../../registry/examples/button/loading";
import OutlineExample from "../../registry/examples/button/outline";
import PillExample from "../../registry/examples/button/pill";
import PrimaryExample from "../../registry/examples/button/primary";
import SaveFlowExample from "../../registry/examples/button/save-flow";
import SecondaryExample from "../../registry/examples/button/secondary";
import SignatureExample from "../../registry/examples/button/signature";
import SizesExample from "../../registry/examples/button/sizes";
import UploadProgressExample from "../../registry/examples/button/upload-progress";
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

export const SaveFlow: Story = { render: () => <SaveFlowExample /> };
export const UploadProgress: Story = { render: () => <UploadProgressExample /> };
export const Failure: Story = { render: () => <FailureExample /> };
export const Signature: Story = { render: () => <SignatureExample /> };
export const Primary: Story = { render: () => <PrimaryExample /> };
export const Gradient: Story = { render: () => <GradientExample /> };
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
