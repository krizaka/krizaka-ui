import type { Meta, StoryObj } from "@storybook/react-vite";

import BookingPanel from "../../registry/examples/shop/booking-panel";
import BookingSticky from "../../registry/examples/shop/booking-sticky";
import BookingStrip from "../../registry/examples/shop/booking-strip";
import Cards from "../../registry/examples/shop/cards";
import Carousel from "../../registry/examples/shop/carousel";
import GalleryFilmstrip from "../../registry/examples/shop/gallery-filmstrip";
import GalleryGrid from "../../registry/examples/shop/gallery-grid";
import GalleryMosaic from "../../registry/examples/shop/gallery-mosaic";
import GalleryWall from "../../registry/examples/shop/gallery-wall";
import BannerExample from "../../registry/examples/shop/hero-banner";
import PosterExample from "../../registry/examples/shop/hero-poster";
import SplitExample from "../../registry/examples/shop/hero-split";
import TvExample from "../../registry/examples/shop/hero-tv";
import Index from "../../registry/examples/shop/index";
import Menu from "../../registry/examples/shop/menu";
import MenuColumns from "../../registry/examples/shop/menu-columns";
import Page from "../../registry/examples/shop/page";

/** Shop page. Each story renders a named example of the registry (`registry/examples/shop/*`), in both themes. */
const meta = { title: "Primitives/Shop", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

// The compact price board: its section is at most 650 px high at 1440 px (ADR-007's mock-up: 633) and one screen at 390 × 844 (811).
export const Menu_: Story = { name: "Services · menu", render: () => <Menu />, parameters: { viewportWidth: 1440, maxHeight: { selector: "section[data-variant=menu]", px: 650 } } };
export const MenuPhone: Story = { name: "Services · menu (phone)", render: () => <Menu />, parameters: { phone: true, noOverflow: true, maxHeight: { selector: "section[data-variant=menu]", px: 844 } } };
export const MenuColumns_: Story = { name: "Services · menu, two columns", render: () => <MenuColumns /> };
export const Cards_: Story = { name: "Services · cards", render: () => <Cards /> };
export const Index_: Story = { name: "Services · index", render: () => <Index /> };
export const Carousel_: Story = { name: "Services · carousel", render: () => <Carousel />, parameters: { phone: true } };

export const HeroPoster: Story = { name: "Hero · poster", render: () => <PosterExample /> };
export const HeroPosterPhone: Story = { name: "Hero · poster (phone)", render: () => <PosterExample />, parameters: { phone: true, noOverflow: true } };
export const HeroSplit: Story = { name: "Hero · split", render: () => <SplitExample /> };
export const HeroSplitPhone: Story = { name: "Hero · split (phone)", render: () => <SplitExample />, parameters: { phone: true, noOverflow: true } };
export const HeroBanner: Story = { name: "Hero · banner", render: () => <BannerExample /> };
export const HeroTv: Story = { name: "Hero · tv", render: () => <TvExample />, parameters: { screenshot: false } };

export const BookingStrip_: Story = { name: "Booking · strip", render: () => <BookingStrip /> };
export const BookingStripPhone: Story = { name: "Booking · strip (phone)", render: () => <BookingStrip />, parameters: { phone: true, noOverflow: true } };
export const BookingPanel_: Story = { name: "Booking · panel", render: () => <BookingPanel /> };
export const BookingSticky_: Story = { name: "Booking · sticky", render: () => <BookingSticky />, parameters: { phone: true } };

export const GalleryMosaic_: Story = { name: "Gallery · mosaic", render: () => <GalleryMosaic /> };
export const GalleryMosaicPhone: Story = { name: "Gallery · mosaic (phone)", render: () => <GalleryMosaic />, parameters: { phone: true, noOverflow: true } };
export const GalleryFilmstrip_: Story = { name: "Gallery · filmstrip", render: () => <GalleryFilmstrip /> };
export const GalleryWall_: Story = { name: "Gallery · wall", render: () => <GalleryWall />, parameters: { screenshot: false } };
export const GalleryGrid_: Story = { name: "Gallery · grid", render: () => <GalleryGrid /> };

export const SalonPage: Story = { name: "A compact salon page", render: () => <Page />, parameters: { viewportWidth: 1440 } };
export const SalonPagePhone: Story = { name: "A compact salon page (phone)", render: () => <Page />, parameters: { phone: true, noOverflow: true } };
