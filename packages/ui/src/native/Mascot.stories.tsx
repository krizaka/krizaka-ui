import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/mascots/native/default";
import LovebirdExample from "../../registry/examples/mascots/native/lovebird";
import { Mascot } from "./mascots";
import { nativeFrame } from "./story-frame";

/**
 * Native — the Krizaka flock in the app's brand colours. The story renders the registry's example
 * (`registry/examples/mascots/native/default.tsx`).
 */
const meta = {
  title: "Native/Mascots",
  component: Mascot,
  decorators: [nativeFrame],
  args: { bird: "owl", mood: "welcome" },
} satisfies Meta<typeof Mascot>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Lovebird: Story = { render: () => <LovebirdExample /> };
