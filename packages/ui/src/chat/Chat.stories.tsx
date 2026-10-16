import type { Meta, StoryObj } from "@storybook/react-vite";

import ConversationExample from "../../registry/examples/chat/conversation";
import InboxExample from "../../registry/examples/chat/inbox";
import PillComposerExample from "../../registry/examples/chat/pill-composer";

/** Chat. Each story renders a named example of the registry (`registry/examples/chat/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/Chat" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Conversation: Story = { render: () => <ConversationExample /> };
export const Inbox: Story = { render: () => <InboxExample /> };
export const PillComposer: Story = { render: () => <PillComposerExample /> };
