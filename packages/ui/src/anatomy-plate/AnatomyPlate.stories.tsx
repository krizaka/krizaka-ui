import type { Meta, StoryObj } from "@storybook/react-vite";

import ButtonExample from "../../registry/examples/anatomy-plate/button";
import { AnatomyPlate } from "./anatomy-plate";

/** AnatomyPlate — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/AnatomyPlate",
  component: AnatomyPlate,
} satisfies Meta<typeof AnatomyPlate>;
export default meta;

type Story = StoryObj;

export const Button: Story = { render: () => <ButtonExample /> };
