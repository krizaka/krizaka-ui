import type { Meta, StoryObj } from "@storybook/react-vite";

import BeaverExample from "../../registry/examples/mascots/beaver";
import CraneExample from "../../registry/examples/mascots/crane";
import EmptyStateExample from "../../registry/examples/mascots/empty-state";
import FlockExample from "../../registry/examples/mascots/flock";
import LongTaskExample from "../../registry/examples/mascots/long-task";
import LovebirdExample from "../../registry/examples/mascots/lovebird";
import MagpieExample from "../../registry/examples/mascots/magpie";
import MoodsExample from "../../registry/examples/mascots/moods";
import OwnToneExample from "../../registry/examples/mascots/own-tone";
import PhoenixExample from "../../registry/examples/mascots/phoenix";
import { Mascot } from "./mascot";

/**
 * The Krizaka flock: nine figures, five moods, in the brand colours of the toolbar's product. Each story renders a named
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
/** The lovebird — "l'inséparable présente": the bird of introductions. */
export const Lovebird: Story = { render: () => <LovebirdExample /> };
export const PhoenixStory: Story = { name: "Phoenix", render: () => <PhoenixExample /> };
/** The crane — "la grue écoute": posed, unhurried, one line; the bird of listening. */
export const Crane: Story = { render: () => <CraneExample /> };
/** The magpie — "la pie compte les points": the score, the standings, the trophies. */
export const Magpie: Story = { render: () => <MagpieExample /> };
/** The beaver — "le castor artisan": the shop at work (Akinaza). */
export const Beaver: Story = { render: () => <BeaverExample /> };
