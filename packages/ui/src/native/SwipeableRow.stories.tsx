import type { Meta, StoryObj } from "@storybook/react-vite";

import ConversationExample from "../../registry/examples/swipeable-row/native/conversation";
import { nativeFrame } from "./story-frame";

/**
 * Native — SwipeableRow. Each story renders a named example of the registry (`registry/examples/swipeable-row/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/SwipeableRow", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Conversation: Story = { render: () => <ConversationExample /> };
