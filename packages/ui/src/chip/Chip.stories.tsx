import type { Meta, StoryObj } from "@storybook/react-vite";

import MarkerPickerExample from "../../registry/examples/chip/marker-picker";
import MultipleExample from "../../registry/examples/chip/multiple";
import RemovableExample from "../../registry/examples/chip/removable";
import SingleExample from "../../registry/examples/chip/single";
import SmallExample from "../../registry/examples/chip/small";
import TagsExample from "../../registry/examples/chip/tags";
import ToggleExample from "../../registry/examples/chip/toggle";
import { Chip } from "./chip";

/**
 * `Chip` on Radix Toggle: alone a pressed button; in `Chip.Group` (`type` single · multiple) an item with roving focus.
 * `removable` + `removeLabel` + `onRemove`: a chosen tag. Each story renders a named example of the registry
 * (`registry/examples/chip/*`).
 */
const meta = {
  title: "Primitives/Chip",
  component: Chip,
  args: { children: "1.5×" },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = { render: () => <ToggleExample /> };
export const Single: Story = { render: () => <SingleExample /> };
export const Multiple: Story = { render: () => <MultipleExample /> };
export const Small: Story = { render: () => <SmallExample /> };
export const Removable: Story = { render: () => <RemovableExample /> };

/** The tags of a workspace (#627): a name with its colour marker (a dot, a ribbon) from the closed palette of six. */
export const Tags: Story = { render: () => <TagsExample /> };
export const MarkerPicker: Story = { render: () => <MarkerPickerExample /> };
