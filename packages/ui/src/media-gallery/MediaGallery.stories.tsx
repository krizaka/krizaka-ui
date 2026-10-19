import type { Meta, StoryObj } from "@storybook/react-vite";

import ShopExample from "../../registry/examples/media-gallery/shop";

/** MediaGallery. Each story renders a named example of the registry (`registry/examples/media-gallery/*`). */
const meta = { title: "Primitives/MediaGallery", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Shop: Story = { render: () => <ShopExample /> };
export const ShopPhone: Story = { render: () => <ShopExample />, parameters: { phone: true } };
