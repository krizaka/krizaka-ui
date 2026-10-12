import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/promise-card/arcade";
import GuaranteeExample from "../../registry/examples/promise-card/guarantee";
import { PromiseCard } from "./promise-card";

/** PromiseCard — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/PromiseCard",
  component: PromiseCard,
} satisfies Meta<typeof PromiseCard>;
export default meta;

type Story = StoryObj;

export const Guarantee: Story = { render: () => <GuaranteeExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
