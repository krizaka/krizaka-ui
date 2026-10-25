import type { Meta, StoryObj } from "@storybook/react-vite";

import SceneExample from "../../registry/examples/taped-photo/scene";
import TopExample from "../../registry/examples/taped-photo/top";
import { TapedPhoto } from "./taped-photo";

/** TapedPhoto — a Cahier block (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/TapedPhoto",
  component: TapedPhoto,
} satisfies Meta<typeof TapedPhoto>;
export default meta;

type Story = StoryObj;

export const Scene: Story = { render: () => <SceneExample /> };
export const Top: Story = { render: () => <TopExample /> };
