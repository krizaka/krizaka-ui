import type { Meta, StoryObj } from "@storybook/react-vite";

import PlainExample from "../../registry/examples/cover-hero/plain";
import ShopExample from "../../registry/examples/cover-hero/shop";

/** CoverHero. Each story renders a named example of the registry (`registry/examples/cover-hero/*`). */
const meta = { title: "Primitives/CoverHero", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Shop: Story = { render: () => <ShopExample /> };
export const ShopPhone: Story = { render: () => <ShopExample />, parameters: { phone: true } };
export const Plain: Story = { render: () => <PlainExample /> };
