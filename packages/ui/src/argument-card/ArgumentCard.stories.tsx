import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import BuildingBlockExample from "../../registry/examples/argument-card/building-block";
import GridExample from "../../registry/examples/argument-card/grid";
import HoverLightExample from "../../registry/examples/argument-card/hover-light";
import HoverQuietExample from "../../registry/examples/argument-card/hover-quiet";
import UnfoldExample from "../../registry/examples/argument-card/unfold";
import { ArgumentCard } from "./argument-card";

/** Argument card — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/ArgumentCard",
  component: ArgumentCard,
} satisfies Meta<typeof ArgumentCard>;
export default meta;

type Story = StoryObj;

export const BuildingBlock: Story = { render: () => <BuildingBlockExample /> };
export const Grid: Story = { render: () => <GridExample /> };
export const Unfold: Story = { render: () => <UnfoldExample /> };
/** The default hover, said explicitly: the pointer's light on each reason. */
export const HoverLight: Story = {
  render: () => <HoverLightExample />,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>(".kz-arg")!;
    expect(card.classList.contains("kz-hover-light")).toBe(true);
    expect(getComputedStyle(card, "::after").display).not.toBe("none");
  },
};

/** The quiet hover: no glow, no light; a ring on the whole card when a link inside takes the focus. */
export const HoverQuiet: Story = {
  render: () => <HoverQuietExample />,
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll<HTMLElement>(".kz-arg")];
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.classList.contains("kz-hover-quiet")).toBe(true);
      expect(getComputedStyle(card, "::after").display).toBe("none");
    }
  },
};
