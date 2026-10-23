import type { Meta, StoryObj } from "@storybook/react-vite";

import CompactToolbarExample from "../../registry/examples/text-style/compact-toolbar";
import ProductPriceExample from "../../registry/examples/text-style/product-price";
import StorefrontTitleExample from "../../registry/examples/text-style/storefront-title";
import { defaultTextStyle, TextStylePicker } from "./index";

/**
 * `TextStylePicker`: the look of one text role as a stored value, with a live preview.
 * Each story renders a named example of the registry (`registry/examples/text-style/*`): the code ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/TextStylePicker",
  component: TextStylePicker,
  args: { value: defaultTextStyle, onChange: () => undefined, previewText: "Boulangerie Martin" },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextStylePicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const StorefrontTitle: Story = { render: () => <StorefrontTitleExample /> };
export const ProductPrice: Story = { render: () => <ProductPriceExample /> };
export const CompactToolbar: Story = { render: () => <CompactToolbarExample defaultOpen /> };
