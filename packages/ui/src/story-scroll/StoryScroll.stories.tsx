import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentExample from "../../registry/examples/story-scroll/document";
import { StoryScroll } from "./story-scroll";

/** StoryScroll — one sticky scene and the steps of a journey. Shot still (reduced motion): the journey's end. */
const meta = {
  title: "Blocks/StoryScroll",
  component: StoryScroll,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoryScroll>;
export default meta;

type Story = StoryObj;

export const Document: Story = { render: () => <DocumentExample /> };
/** On a phone (390 × 844). */
export const DocumentPhone: Story = { render: () => <DocumentExample />, parameters: { phone: true } };
