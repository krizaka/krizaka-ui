import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import DocsHubExample from "../../registry/examples/link-card/docs-hub";
import ExternalExample from "../../registry/examples/link-card/external";
import HoverLightExample from "../../registry/examples/link-card/hover-light";
import HoverQuietExample from "../../registry/examples/link-card/hover-quiet";
import StackExample from "../../registry/examples/link-card/stack";
import { LinkCard } from "./link-card";

/** Link card — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/LinkCard",
  component: LinkCard,
} satisfies Meta<typeof LinkCard>;
export default meta;

type Story = StoryObj;

export const DocsHub: Story = { render: () => <DocsHubExample /> };
export const Stack: Story = { render: () => <StackExample /> };
export const External: Story = { render: () => <ExternalExample /> };

/** The default hover, said explicitly: the card under the pointer is lit by the light (its `::after`). */
export const HoverLight: Story = {
  render: () => <HoverLightExample />,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>(".kz-link-card")!;
    expect(card.classList.contains("kz-hover-light")).toBe(true);
    expect(getComputedStyle(card, "::after").display).not.toBe("none");
  },
};

/** The quiet hover: no glow, no light, a ring on focus. */
export const HoverQuiet: Story = {
  render: () => <HoverQuietExample />,
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll<HTMLElement>(".kz-link-card")];
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.classList.contains("kz-hover-quiet")).toBe(true);
      expect(getComputedStyle(card, "::after").display).toBe("none");
    }
  },
};
