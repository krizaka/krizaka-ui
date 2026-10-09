import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Button, IconButton } from "./button";
import { nativeFrame } from "./story-frame";
import { CloseIcon, PlusIcon } from "./story-icons";
import { useTheme } from "./theme";

/** Native — the action: `variant` × `size` × `shape`, `loading`, `icon`. `label` is the text and the accessible name. */
const meta = {
  title: "Native/Button",
  component: Button,
  decorators: [nativeFrame],
  args: { label: "Continue" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Danger: Story = { args: { variant: "danger", label: "Delete" } };

/** sm · md · lg, and `shape="pill"`. */
export const Sizes: Story = {
  render: (args) => (
    <>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" shape="pill" />
    </>
  ),
  args: { variant: "primary" },
};

function WithIcon() {
  const { theme } = useTheme();
  return <Button variant="primary" label="New set" icon={<PlusIcon color={theme.onAccent} />} />;
}

/** `icon` before the label. */
export const Icon: Story = { render: () => <WithIcon /> };

export const Disabled: Story = { args: { variant: "primary", disabled: true } };

/** Disabled and busy, a spinner in place of the icon. */
export const Loading: Story = { args: { variant: "primary", loading: true, label: "Saving…" } };

function IconButtons() {
  const { theme } = useTheme();
  return (
    <>
      <IconButton label="Close" variant="ghost" icon={<CloseIcon />} />
      <IconButton label="Add" variant="primary" shape="pill" icon={<PlusIcon color={theme.onAccent} />} />
    </>
  );
}

/** `IconButton`: `label` is required, it is the accessible name. */
export const IconOnly: Story = { render: () => <IconButtons /> };
