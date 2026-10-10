import type { Meta, StoryObj } from "@storybook/react-vite";

import SectionBackdropDemo from "../../registry/demos/section-backdrop";
import { SectionBackdrop } from "./section-backdrop";

/**
 * The backdrop of a page section: the brand's section gradient, a light dome, an optional perspective grid and a
 * blurred foreground (depth of field). Switch the toolbar's Brand to see each brand's temperature.
 */
const meta = {
  title: "Primitives/SectionBackdrop",
  component: SectionBackdrop,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SectionBackdrop>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The demo of the registry (`registry/demos/section-backdrop.tsx`). */
export const Hero: Story = { render: () => <SectionBackdropDemo /> };

/** Without the grid nor the dome: the gradient alone. */
export const Plain: Story = {
  args: { dome: false, className: "px-8 py-12" },
  render: (args) => (
    <SectionBackdrop {...args}>
      <p className="text-fg">The gradient alone, ending on the page surface.</p>
    </SectionBackdrop>
  ),
};

/** `direction="up"`: the tint at the bottom, for a closing call to action. */
export const Up: Story = {
  args: { direction: "up", className: "px-8 py-12" },
  render: (args) => (
    <SectionBackdrop {...args}>
      <p className="text-fg">Start in minutes.</p>
    </SectionBackdrop>
  ),
};

/** Two sections in a row: the first ends where the second begins. */
export const Sequence: Story = {
  render: () => (
    <div>
      <SectionBackdrop grid className="px-8 py-14">
        <p className="text-xl font-semibold text-fg">One section</p>
      </SectionBackdrop>
      <SectionBackdrop dome={false} className="px-8 py-14">
        <p className="text-xl font-semibold text-fg">The next one</p>
      </SectionBackdrop>
    </div>
  ),
};

/** A foreground blurred for depth of field (`media`): decorative, behind the content. */
export const DepthOfField: Story = {
  args: { className: "px-8 py-16" },
  render: (args) => (
    <SectionBackdrop
      {...args}
      media={<div className="absolute -bottom-10 left-6 h-40 w-40 rounded-xl border border-border-strong bg-accent-soft" />}
    >
      <p className="text-xl font-semibold text-fg">Depth of field</p>
    </SectionBackdrop>
  ),
};
