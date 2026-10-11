import type { Meta, StoryObj } from "@storybook/react-vite";

import ReadingPageExample from "../../registry/examples/toc/reading-page";
import { Toc } from "./toc";

/** Table of contents — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/Toc",
  component: Toc,
} satisfies Meta<typeof Toc>;
export default meta;

type Story = StoryObj;

export const ReadingPage: Story = { render: () => <ReadingPageExample /> };
