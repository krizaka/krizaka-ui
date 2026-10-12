import type { Meta, StoryObj } from "@storybook/react-vite";

import MadeHereExample from "../../registry/examples/gallery-page/made-here";
import { GalleryPage } from "./gallery-page";

/** Gallery page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/GalleryPage",
  component: GalleryPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GalleryPage>;
export default meta;

type Story = StoryObj;

export const MadeHere: Story = { render: () => <MadeHereExample /> };
/** On a phone (390 × 844). */
export const MadeHerePhone: Story = { render: () => <MadeHereExample />, parameters: { phone: true } };
