import type { Meta, StoryObj } from "@storybook/react-vite";

import BirdSketchExample from "../../registry/examples/doodle/bird-sketch";
import MarginMarksExample from "../../registry/examples/doodle/margin-marks";
import { Doodle } from "./doodle";

/** Doodle — a retro block of the Krizaka style. Each story renders a named example. */
const meta = {
  title: "Blocks/Doodle",
  component: Doodle,
} satisfies Meta<typeof Doodle>;
export default meta;

type Story = StoryObj;

export const MarginMarks: Story = { render: () => <MarginMarksExample /> };
export const BirdSketch: Story = { render: () => <BirdSketchExample /> };
