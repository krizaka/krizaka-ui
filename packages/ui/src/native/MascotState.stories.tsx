import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/mascot-state/native/default";
import { MascotState } from "./mascot-state";
import { nativeFrame } from "./story-frame";

/**
 * Native — a moment told by a bird of the flock. The story renders the registry's example
 * (`registry/examples/mascot-state/native/default.tsx`).
 */
const meta = {
  title: "Native/MascotState",
  component: MascotState,
  decorators: [nativeFrame],
  args: { title: "Payment received" },
} satisfies Meta<typeof MascotState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
