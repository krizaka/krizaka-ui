import type { Meta, StoryObj } from "@storybook/react-vite";

import ButtonDemo from "../../registry/demos/button";
import { Button, IconButton } from "./button";

/** The action. `variant` × `size` × `shape`, `loading`, `asChild`; `buttonVariants` styles a link without the component. */
const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Continue" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The main action of a view: the accent. The demo of the registry (`registry/demos/button.tsx`). */
export const Primary: Story = { render: () => <ButtonDemo /> };

/** The default: a raised surface. */
export const Secondary: Story = {};

export const Outline: Story = { args: { variant: "outline" } };

export const Ghost: Story = { args: { variant: "ghost" } };

/** A destructive action: the border and the tint carry the danger, the label stays legible in both themes. */
export const Danger: Story = { args: { variant: "danger", children: "Delete" } };

/** sm · md · lg. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
  args: { variant: "primary" },
};

/** `shape="pill"`. */
export const Pill: Story = { args: { variant: "primary", shape: "pill" } };

export const Disabled: Story = { args: { variant: "primary", disabled: true } };

/** Disabled, `aria-busy` and `data-loading`: the product adds its own spinner if it wants one. */
export const Loading: Story = { args: { variant: "primary", loading: true, children: "Saving…" } };

/** `asChild`: the `<a>` is rendered, with the button's classes and props merged. */
export const AsChildLink: Story = {
  args: { variant: "outline", asChild: true, children: <a href="#docs">Read the docs</a> },
};

/** `IconButton`: `label` is required, it is the accessible name. */
export const Icon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton label="Close" variant="ghost">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </IconButton>
      <IconButton label="Add" variant="primary" shape="pill">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
    </div>
  ),
};
