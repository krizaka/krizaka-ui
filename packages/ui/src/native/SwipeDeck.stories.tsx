import type { Meta, StoryObj } from "@storybook/react-vite";

import DiscoverExample from "../../registry/examples/swipe-deck/native/discover";
import { nativeFrame } from "./story-frame";

/** Native — SwipeDeck. Each story renders a named example of the registry (`registry/examples/swipe-deck/native/*`). */
const meta = { title: "Native/SwipeDeck", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Discover: Story = { render: () => <DiscoverExample /> };
