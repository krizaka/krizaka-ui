import type { Meta, StoryObj } from "@storybook/react-vite";

import DotExample from "../../registry/examples/badge/native/dot";
import ScrimExample from "../../registry/examples/badge/native/scrim";
import TonesExample from "../../registry/examples/badge/native/tones";
import { Badge } from "./badge";
import { nativeFrame } from "./story-frame";

/**
 * Native — a short status in capitals: `tone`, `size`, `dot` (pulsing with `pulse`, still under reduced motion).
 * Each story renders a named example of the registry (`registry/examples/badge/native/*`).
 */
const meta = {
  title: "Native/Badge",
  component: Badge,
  decorators: [nativeFrame],
  args: { children: "Live" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = { render: () => <TonesExample /> };
export const Dot: Story = { render: () => <DotExample /> };
export const Scrim: Story = { render: () => <ScrimExample /> };
