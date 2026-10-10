import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Chip } from "./chip";
import { nativeFrame } from "./story-frame";

/**
 * Native — a pill: alone a checkbox (`selected` / `onSelectedChange`), in `Chip.Group` a radio (`single`) or a
 * checkbox (`multiple`), or `removable`. `scrollable` makes the group one horizontal row (a filter bar).
 */
const meta = {
  title: "Native/Chip",
  component: Chip,
  decorators: [nativeFrame],
  args: { children: "Night" },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Off and on; sm · md. */
export const Toggle: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <Chip>Night</Chip>
      <Chip defaultSelected>Live</Chip>
      <Chip size="sm" defaultSelected>
        Small
      </Chip>
      <Chip disabled>Disabled</Chip>
    </View>
  ),
};

/** `Chip.Group type="single"`: one value. */
export const Single: Story = {
  render: () => (
    <Chip.Group type="single" defaultValue="all" aria-label="Filter">
      <Chip value="all">All</Chip>
      <Chip value="live">Live</Chip>
      <Chip value="ending">Ending soon</Chip>
    </Chip.Group>
  ),
};

/** `Chip.Group type="multiple" scrollable`: a filter bar. */
export const Multiple: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Chip.Group type="multiple" defaultValue={["house", "techno"]} aria-label="Genres" scrollable>
        <Chip value="house">House</Chip>
        <Chip value="techno">Techno</Chip>
        <Chip value="ambient">Ambient</Chip>
        <Chip value="jazz">Jazz</Chip>
        <Chip value="soul">Soul</Chip>
      </Chip.Group>
    </View>
  ),
};

/** `removable`: a chosen tag with its own named remove button. */
export const Removable: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Chip removable removeLabel="Remove #night" onRemove={() => undefined}>
        #night
      </Chip>
      <Chip removable removeLabel="Remove #live" onRemove={() => undefined}>
        #live
      </Chip>
    </View>
  ),
};
