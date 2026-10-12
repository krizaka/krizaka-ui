import type { Meta, StoryObj } from "@storybook/react-vite";

import BackdropExample from "../../registry/examples/landscape/backdrop";
import BrandExample from "../../registry/examples/landscape/brand";
import { Landscape } from "./landscape";

/** Landscape — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/Landscape",
  component: Landscape,
} satisfies Meta<typeof Landscape>;
export default meta;

type Story = StoryObj;

export const Backdrop: Story = { render: () => <BackdropExample /> };
export const Brand: Story = { render: () => <BrandExample /> };
