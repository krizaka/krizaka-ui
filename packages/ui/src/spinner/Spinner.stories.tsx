import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/spinner/default";
import MutedExample from "../../registry/examples/spinner/muted";
import SizesExample from "../../registry/examples/spinner/sizes";
import { Spinner } from "./spinner";

/**
 * An indeterminate wait (`role="status"`, named by `label`). It stops turning under reduced motion.
 * Each story renders a named example of the registry (`registry/examples/spinner/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Spinner",
  component: Spinner,
  args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Sizes: Story = { render: () => <SizesExample /> };
export const Muted: Story = { render: () => <MutedExample /> };
