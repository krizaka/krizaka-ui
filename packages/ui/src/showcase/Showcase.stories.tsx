import type { Meta, StoryObj } from "@storybook/react-vite";

import PromptImageExample from "../../registry/examples/showcase/prompt-image";
import SlidesExample from "../../registry/examples/showcase/slides";

/** A slideshow that advances by itself, with a visible progress bar. Each story renders a named example. The test runner reduces motion: the screenshots show the still state (no pause button, the current segment full). */
const meta = { title: "Primitives/Showcase" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const PromptImage: Story = { render: () => <PromptImageExample /> };
export const Slides: Story = { render: () => <SlidesExample /> };
