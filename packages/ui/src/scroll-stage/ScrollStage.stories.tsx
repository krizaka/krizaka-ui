import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/scroll-stage/arcade";
import ChaptersExample from "../../registry/examples/scroll-stage/chapters";
import { ScrollStage } from "./scroll-stage";

/** ScrollStage — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/ScrollStage",
  component: ScrollStage,
} satisfies Meta<typeof ScrollStage>;
export default meta;

type Story = StoryObj;

export const Chapters: Story = { render: () => <ChaptersExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
