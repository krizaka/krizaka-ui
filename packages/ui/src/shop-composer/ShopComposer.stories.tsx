import type { Meta, StoryObj } from "@storybook/react-vite";

import ComposerExample from "../../registry/examples/shop-composer/composer";

/** ShopComposer. Each story renders a named example of the registry (`registry/examples/shop-composer/*`). */
const meta = { title: "Primitives/ShopComposer", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Composer: Story = { render: () => <ComposerExample />, parameters: { viewportWidth: 1440 } };
// On a phone: two steps — the list of sections, then the section — and the preview behind « View ».
export const ComposerPhone: Story = { render: () => <ComposerExample />, parameters: { phone: true, noOverflow: true } };
