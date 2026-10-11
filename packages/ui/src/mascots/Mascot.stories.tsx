import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyStateExample from "../../registry/examples/mascots/empty-state";
import FlockExample from "../../registry/examples/mascots/flock";
import LongTaskExample from "../../registry/examples/mascots/long-task";
import MoodsExample from "../../registry/examples/mascots/moods";
import OwnToneExample from "../../registry/examples/mascots/own-tone";
import { Mascot } from "./mascot";

/**
 * The Krizaka flock: five birds, five moods, in the brand colours of the toolbar's product. Each story renders a named
 * example of the registry (`registry/examples/mascots/*`). Still in the screenshots (reduced motion).
 */
const meta = {
  title: "Primitives/Mascot",
  component: Mascot,
  args: { bird: "owl", mood: "welcome" },
} satisfies Meta<typeof Mascot>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Moods: Story = { render: () => <MoodsExample /> };
export const Flock: Story = { render: () => <FlockExample /> };
export const OwnTone: Story = { render: () => <OwnToneExample /> };
export const InAnEmptyState: Story = { render: () => <EmptyStateExample /> };
export const DuringALongTask: Story = { render: () => <LongTaskExample /> };
