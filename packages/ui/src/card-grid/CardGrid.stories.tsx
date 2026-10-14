import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import AlignedExample from "../../registry/examples/card-grid/aligned";
import ProductsExample from "../../registry/examples/card-grid/products";
import RevealExample from "../../registry/examples/card-grid/reveal";
import { CardGrid } from "./card-grid";

/** Card grid — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/CardGrid",
  component: CardGrid,
} satisfies Meta<typeof CardGrid>;
export default meta;

type Story = StoryObj;

export const Products: Story = { render: () => <ProductsExample /> };
export const Reveal: Story = { render: () => <RevealExample /> };

/**
 * Cards of unequal text in one row: the cells share one height and the facts and the way in of every card sit on the
 * same line (the footer is pinned to the bottom). Measured in the browser, as laid out.
 */
export const Aligned: Story = {
  render: () => <AlignedExample />,
  play: async ({ canvasElement }) => {
    const cards = [...canvasElement.querySelectorAll<HTMLElement>(".kz-link-card")];
    const tops = (selector: string) => cards.map((card) => Math.round(card.querySelector(selector)!.getBoundingClientRect().top));
    expect(cards).toHaveLength(3);
    // A single row: the test means nothing if the viewport wrapped the cards.
    expect(new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top))).size, "one row").toBe(1);
    expect(new Set(cards.map((c) => Math.round(c.getBoundingClientRect().height))).size, "one height").toBe(1);
    expect(new Set(tops(".kz-fact")).size, "facts on one line").toBe(1);
    expect(new Set(tops(".kz-link-card-cta")).size, "the way in on one line").toBe(1);
  },
};
