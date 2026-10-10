import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { nativeFrame } from "./story-frame";
import { Txt } from "./txt";

/** Native — text in the platform's scale, coloured by a role of the theme (`variant` × `tone`). */
const meta = {
  title: "Native/Txt",
  component: Txt,
  decorators: [nativeFrame],
  args: { children: "Every night, a new set." },
} satisfies Meta<typeof Txt>;
export default meta;

type Story = StoryObj<typeof meta>;

/** display · title · body · caption · label · mono. */
export const Variants: Story = {
  render: (args) => (
    <>
      <Txt {...args} variant="display" />
      <Txt {...args} variant="title" />
      <Txt {...args} variant="body" />
      <Txt {...args} variant="caption" />
      <Txt {...args} variant="label" />
      <Txt variant="mono">01:24:09</Txt>
    </>
  ),
};

/**
 * The text roles: text · secondary · accent; `muted` (placeholders, what is off) reaches AA only as large text, like the
 * status roles.
 */
export const Tones: Story = {
  render: (args) => (
    <>
      <Txt {...args} tone="text" />
      <Txt {...args} tone="secondary" />
      <Txt {...args} tone="muted" variant="display" />
      <Txt {...args} tone="accent" variant="title" />
    </>
  ),
};
