import type { Meta, StoryObj } from "@storybook/react-vite";

import ChipDemo from "../../registry/demos/chip";
import { Chip } from "./chip";

/**
 * `Chip` on Radix Toggle: alone it is a pressed button (`selected` / `onSelectedChange`); in `Chip.Group` (`type`
 * single · multiple) an item with roving focus. `removable` + `removeLabel` + `onRemove`: a chosen tag.
 */
const meta = {
  title: "Primitives/Chip",
  component: Chip,
  args: { children: "1.5×" },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Alone, off and on. */
export const Toggle: Story = { render: () => <ChipDemo /> };

/** One choice (radios): a filter. `required` keeps one chosen. */
export const Single: Story = {
  render: () => (
    <Chip.Group type="single" label="Format" defaultValue="all" required>
      <Chip value="all">All</Chip>
      <Chip value="videos">Videos</Chip>
      <Chip value="stories">Stories</Chip>
      <Chip value="collections">Collections</Chip>
    </Chip.Group>
  ),
};

/** Several choices (pressed buttons). */
export const Multiple: Story = {
  render: () => (
    <Chip.Group type="multiple" label="Tags" defaultValue={["night", "rain"]}>
      <Chip value="night">#night</Chip>
      <Chip value="city">#city</Chip>
      <Chip value="rain">#rain</Chip>
      <Chip value="neon">#neon</Chip>
    </Chip.Group>
  ),
};

/** `size="sm"`. */
export const Small: Story = {
  render: () => (
    <Chip.Group type="single" label="Speed" size="sm" defaultValue="1">
      <Chip value="0.5">0.5×</Chip>
      <Chip value="1">1×</Chip>
      <Chip value="1.5">1.5×</Chip>
      <Chip value="2">2×</Chip>
    </Chip.Group>
  ),
};

/** Chosen tags, each with a named remove button. */
export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip removable removeLabel="Remove #night" onRemove={() => {}}>
        #night
      </Chip>
      <Chip removable removeLabel="Remove #city" onRemove={() => {}}>
        #city
      </Chip>
    </div>
  ),
};
