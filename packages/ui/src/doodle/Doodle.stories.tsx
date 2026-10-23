import type { Meta, StoryObj } from "@storybook/react-vite";

import KindsExample from "../../registry/examples/doodle/kinds";
import MarginExample from "../../registry/examples/doodle/margin";
import { Doodle } from "./doodle";

/** Doodle — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/Doodle",
  component: Doodle,
} satisfies Meta<typeof Doodle>;
export default meta;

type Story = StoryObj;

export const Kinds: Story = { render: () => <KindsExample /> };
export const Margin: Story = { render: () => <MarginExample /> };
