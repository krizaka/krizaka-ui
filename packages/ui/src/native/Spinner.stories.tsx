import type { Meta, StoryObj } from "@storybook/react-vite";

import SizesExample from "../../registry/examples/spinner/native/sizes";
import { Spinner } from "./spinner";
import { nativeFrame } from "./story-frame";

/**
 * Native — the platform's indicator in the accent, named by `label`.
 * Each story renders a named example of the registry (`registry/examples/spinner/native/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Native/Spinner",
  component: Spinner,
  decorators: [nativeFrame],
  args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = { render: () => <SizesExample /> };
