import type { Meta, StoryObj } from "@storybook/react-vite";

import BrickExample from "../../registry/examples/wall/brick";
import CompositionExample from "../../registry/examples/wall/composition";
import PinnedNoteExample from "../../registry/examples/wall/pinned-note";
import PlasterExample from "../../registry/examples/wall/plaster";
import PolaroidExample from "../../registry/examples/wall/polaroid";
import RidgeExample from "../../registry/examples/wall/ridge";
import ShopSignExample from "../../registry/examples/wall/shop-sign";
import ZelligeExample from "../../registry/examples/wall/zellige";

const meta = { title: "Blocks/Wall", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composition: Story = { render: () => <CompositionExample /> };
export const CompositionPhone: Story = { render: () => <CompositionExample />, parameters: { phone: true } };
export const Brick: Story = { render: () => <BrickExample /> };
export const Zellige: Story = { render: () => <ZelligeExample /> };
export const Ridge: Story = { render: () => <RidgeExample /> };
export const Plaster: Story = { render: () => <PlasterExample /> };
export const Polaroid: Story = { render: () => <PolaroidExample /> };
export const PinnedNote: Story = { render: () => <PinnedNoteExample /> };
export const ShopSign: Story = { render: () => <ShopSignExample /> };
