import type { Meta, StoryObj } from "@storybook/react-vite";

import BandsExample from "../../registry/examples/product-page/bands";
import FixtureExample from "../../registry/examples/product-page/fixture";
import FooterExample from "../../registry/examples/product-page/footer";
import HeroExample from "../../registry/examples/product-page/hero";
import ScenesExample from "../../registry/examples/product-page/scenes";
import { ProductPage } from "./product-page";

/** Product page — a page template from data only, and its blocks. Each story renders a named example; the runner shoots them still (reduced motion). */
const meta = {
  title: "Templates/ProductPage",
  component: ProductPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductPage>;
export default meta;

type Story = StoryObj;

export const Fixture: Story = { render: () => <FixtureExample /> };
/** On a phone (390 × 844): the hero's document shrinks to the finding, the story's steps pass under its stage. */
export const FixturePhone: Story = { render: () => <FixtureExample />, parameters: { phone: true } };
export const Hero: Story = { render: () => <HeroExample /> };
export const HeroPhone: Story = { render: () => <HeroExample />, parameters: { phone: true } };
export const Scenes: Story = { render: () => <ScenesExample /> };
export const Bands: Story = { render: () => <BandsExample /> };
export const Footer: Story = { render: () => <FooterExample /> };
