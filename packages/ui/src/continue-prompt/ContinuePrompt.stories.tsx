import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/continue-prompt/arcade";
import OfferExample from "../../registry/examples/continue-prompt/offer";
import { ContinuePrompt } from "./continue-prompt";

/** ContinuePrompt — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/ContinuePrompt",
  component: ContinuePrompt,
} satisfies Meta<typeof ContinuePrompt>;
export default meta;

type Story = StoryObj;

export const Offer: Story = { render: () => <OfferExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
