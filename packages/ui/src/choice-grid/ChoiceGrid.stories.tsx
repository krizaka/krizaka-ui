import type { Meta, StoryObj } from "@storybook/react-vite";

import LineUpExample from "../../registry/examples/choice-grid/line-up";
import PlansExample from "../../registry/examples/choice-grid/plans";
import { ChoiceGrid } from "./choice-grid";

/** ChoiceGrid — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/ChoiceGrid",
  component: ChoiceGrid,
} satisfies Meta<typeof ChoiceGrid>;
export default meta;

type Story = StoryObj;

export const Plans: Story = { render: () => <PlansExample /> };
export const LineUp: Story = { render: () => <LineUpExample /> };
