import type { Meta, StoryObj } from "@storybook/react-vite";

import CutExample from "../../registry/examples/card/cut";
import GlassExample from "../../registry/examples/card/glass";
import InteractiveLinkExample from "../../registry/examples/card/interactive-link";
import MediaCardExample from "../../registry/examples/card/media-card";
import MediaFallbackExample from "../../registry/examples/card/media-fallback";
import OutlineExample from "../../registry/examples/card/outline";
import RevealGridExample from "../../registry/examples/card/reveal-grid";
import SpotlightExample from "../../registry/examples/card/spotlight";
import StatCardExample from "../../registry/examples/card/stat-card";
import { Card } from "./card";

/**
 * `Card.Root/Media/Image/Overlay/Body/Title/Description/Stat/Footer` — one `tv` definition with slots, server-safe.
 * `asChild` turns the card into a link, `interactive` adds the spotlight and the lift, `reveal` the entrance on scroll.
 * Each story renders a named example of the registry (`registry/examples/card/*`).
 */
const meta = {
  title: "Primitives/Card",
  component: Card.Root,
  decorators: [
    (Story, { parameters }) => (
      <div className={parameters.wide ? "w-[44rem] max-w-full" : "w-72"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const MediaCard: Story = { render: () => <MediaCardExample /> };
export const MediaFallback: Story = { render: () => <MediaFallbackExample /> };
export const InteractiveLink: Story = { render: () => <InteractiveLinkExample /> };
export const StatCard: Story = { render: () => <StatCardExample /> };
export const RevealGrid: Story = { render: () => <RevealGridExample />, parameters: { wide: true } };
export const Spotlight: Story = { render: () => <SpotlightExample /> };
export const Glass: Story = { render: () => <GlassExample /> };
export const Outline: Story = { render: () => <OutlineExample /> };
export const Cut: Story = { render: () => <CutExample /> };
