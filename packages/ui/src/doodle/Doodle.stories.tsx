import type { Meta, StoryObj } from "@storybook/react-vite";

import BirdSketchExample from "../../registry/examples/doodle/bird-sketch";
import KindsExample from "../../registry/examples/doodle/kinds";
import MarginExample from "../../registry/examples/doodle/margin";
import MarginMarksExample from "../../registry/examples/doodle/margin-marks";
import { Doodle } from "./doodle";

/** Doodle — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/Doodle",
  component: Doodle,
} satisfies Meta<typeof Doodle>;
export default meta;

type Story = StoryObj;

export const Kinds: Story = { render: () => <KindsExample /> };
export const Margin: Story = { render: () => <MarginExample />, parameters: { viewportWidth: 1360, noOverflow: true } };
export const MarginMarks: Story = { render: () => <MarginMarksExample /> };
export const BirdSketch: Story = { render: () => <BirdSketchExample /> };
