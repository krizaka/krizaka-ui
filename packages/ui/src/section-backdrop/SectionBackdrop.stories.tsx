import type { Meta, StoryObj } from "@storybook/react-vite";

import DepthOfFieldExample from "../../registry/examples/section-backdrop/depth-of-field";
import HeroExample from "../../registry/examples/section-backdrop/hero";
import PlainExample from "../../registry/examples/section-backdrop/plain";
import SequenceExample from "../../registry/examples/section-backdrop/sequence";
import UpExample from "../../registry/examples/section-backdrop/up";
import { SectionBackdrop } from "./section-backdrop";

/**
 * The backdrop of a page section: the brand's gradient, a light dome, an optional grid and a blurred foreground.
 * Switch the toolbar's Brand to see each brand's temperature. Each story renders a named example of the registry (`registry/examples/section-backdrop/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/SectionBackdrop",
  component: SectionBackdrop,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SectionBackdrop>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Hero: Story = { render: () => <HeroExample /> };
export const Plain: Story = { render: () => <PlainExample /> };
export const Up: Story = { render: () => <UpExample /> };
export const Sequence: Story = { render: () => <SequenceExample /> };
export const DepthOfField: Story = { render: () => <DepthOfFieldExample /> };
