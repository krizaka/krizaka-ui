import type { Meta, StoryObj } from "@storybook/react-vite";

import MultipleExample from "../../registry/examples/chip/native/multiple";
import RemovableExample from "../../registry/examples/chip/native/removable";
import SingleExample from "../../registry/examples/chip/native/single";
import ToggleExample from "../../registry/examples/chip/native/toggle";
import { Chip } from "./chip";
import { nativeFrame } from "./story-frame";

/**
 * Native — a pill: alone a checkbox, in `Chip.Group` a radio (`single`) or a checkbox (`multiple`), or `removable`.
 * Each story renders a named example of the registry (`registry/examples/chip/native/*`).
 */
const meta = {
  title: "Native/Chip",
  component: Chip,
  decorators: [nativeFrame],
  args: { children: "Night" },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = { render: () => <ToggleExample /> };
export const Single: Story = { render: () => <SingleExample /> };
export const Multiple: Story = { render: () => <MultipleExample /> };
export const Removable: Story = { render: () => <RemovableExample /> };
