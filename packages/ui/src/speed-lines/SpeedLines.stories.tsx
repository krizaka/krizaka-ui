import type { Meta, StoryObj } from "@storybook/react-vite";

import HeroExample from "../../registry/examples/speed-lines/hero";
import StreaksExample from "../../registry/examples/speed-lines/streaks";
import { SpeedLines } from "./speed-lines";

/** SpeedLines — a retro block of the Krizaka style. Each story renders a named example. */
const meta = {
  title: "Blocks/SpeedLines",
  component: SpeedLines,
} satisfies Meta<typeof SpeedLines>;
export default meta;

type Story = StoryObj;

export const Hero: Story = { render: () => <HeroExample /> };
export const Streaks: Story = { render: () => <StreaksExample /> };
