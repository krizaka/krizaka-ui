import type { Meta, StoryObj } from "@storybook/react-vite";

import CarouselExample from "../../registry/examples/media-gallery/carousel";
import CarouselAutoplayExample from "../../registry/examples/media-gallery/carousel-autoplay";
import CarouselCahierExample from "../../registry/examples/media-gallery/carousel-cahier";
import CarouselDemoExample from "../../registry/examples/media-gallery/carousel-demo";
import CarouselLoopExample from "../../registry/examples/media-gallery/carousel-loop";
import CarouselSingleExample from "../../registry/examples/media-gallery/carousel-single";
import PlayerExample from "../../registry/examples/media-gallery/player";
import PlayerTriggerExample from "../../registry/examples/media-gallery/player-trigger";
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
export const CarouselSingle: Story = { render: () => <CarouselSingleExample /> };
export const CarouselSinglePhone: Story = { render: () => <CarouselSingleExample />, parameters: { phone: true } };
export const CarouselLoop: Story = { render: () => <CarouselLoopExample /> };
export const CarouselLoopPhone: Story = { render: () => <CarouselLoopExample />, parameters: { phone: true } };
export const PlayerTrigger: Story = { render: () => <PlayerTriggerExample /> };
export const PlayerTriggerPhone: Story = { render: () => <PlayerTriggerExample />, parameters: { phone: true } };
export const CarouselAutoplay: Story = { render: () => <CarouselAutoplayExample /> };
export const CarouselAutoplayPhone: Story = { render: () => <CarouselAutoplayExample />, parameters: { phone: true } };
export const CarouselCahier: Story = { render: () => <CarouselCahierExample /> };
export const CarouselCahierPhone: Story = { render: () => <CarouselCahierExample />, parameters: { phone: true } };
export const CarouselDemo: Story = { render: () => <CarouselDemoExample /> };
export const CarouselDemoPhone: Story = { render: () => <CarouselDemoExample />, parameters: { phone: true } };
