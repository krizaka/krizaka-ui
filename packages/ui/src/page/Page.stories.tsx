import type { Meta, StoryObj } from "@storybook/react-vite";

import BackdropExample from "../../registry/examples/page/backdrop";
import FactsExample from "../../registry/examples/page/facts";
import FrameExample from "../../registry/examples/page/frame";
import SectionsExample from "../../registry/examples/page/sections";
import { Page } from "./page";

/** Page — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/Page",
  component: Page,
} satisfies Meta<typeof Page>;
export default meta;

type Story = StoryObj;

export const Sections: Story = { render: () => <SectionsExample /> };
export const Backdrop: Story = { render: () => <BackdropExample /> };
export const Frame: Story = { render: () => <FrameExample /> };
export const Facts: Story = { render: () => <FactsExample /> };
