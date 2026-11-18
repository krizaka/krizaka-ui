import type { Meta, StoryObj } from "@storybook/react-vite";

import DocsHubExample from "../../registry/examples/link-card/docs-hub";
import ExternalExample from "../../registry/examples/link-card/external";
import HoverQuietExample from "../../registry/examples/link-card/hover-quiet";
import StackExample from "../../registry/examples/link-card/stack";
import { expectQuietHover } from "../quiet-hover.story-check";
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

/** The hover of every card: its surface and hairline go one step up; nothing moves, no light. */
export const HoverQuiet: Story = {
  render: () => <HoverQuietExample />,
  play: ({ canvasElement }) => expectQuietHover(canvasElement, ".kz-link-card"),
};
