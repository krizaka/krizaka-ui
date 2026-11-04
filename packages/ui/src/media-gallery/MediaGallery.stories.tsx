import type { Meta, StoryObj } from "@storybook/react-vite";

import CarouselExample from "../../registry/examples/media-gallery/carousel";
import PlayerExample from "../../registry/examples/media-gallery/player";
import ShopExample from "../../registry/examples/media-gallery/shop";

/** MediaGallery. Each story renders a named example of the registry (`registry/examples/media-gallery/*`). */
const meta = { title: "Primitives/MediaGallery", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Shop: Story = { render: () => <ShopExample /> };
export const ShopPhone: Story = { render: () => <ShopExample />, parameters: { phone: true } };
export const Carousel: Story = { render: () => <CarouselExample /> };
export const CarouselPhone: Story = { render: () => <CarouselExample />, parameters: { phone: true } };
export const Player: Story = { render: () => <PlayerExample /> };
export const PlayerPhone: Story = { render: () => <PlayerExample />, parameters: { phone: true } };
