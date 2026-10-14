import type { Meta, StoryObj } from "@storybook/react-vite";

import DiscoverExample from "../../registry/examples/swipe-deck/discover";

/** SwipeDeck. Each story renders a named example of the registry (`registry/examples/swipe-deck/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/SwipeDeck" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Discover: Story = { render: () => <DiscoverExample /> };
