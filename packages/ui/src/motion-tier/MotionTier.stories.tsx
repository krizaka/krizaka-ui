import type { Meta, StoryObj } from "@storybook/react-vite";

import DepthExample from "../../registry/examples/motion-tier/depth";
import { DepthField } from "./motion-tier";

/** Motion tier — the tier this device affords and the pointer's layers of depth (still in the runner: reduced motion). */
const meta = {
  title: "Foundations/MotionTier",
  component: DepthField,
} satisfies Meta<typeof DepthField>;
export default meta;

type Story = StoryObj;

export const Depth: Story = { render: () => <DepthExample /> };
