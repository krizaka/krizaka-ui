import type { Meta, StoryObj } from "@storybook/react-vite";

import AssistantExample from "../../registry/examples/chat/native/assistant";
import ConversationExample from "../../registry/examples/chat/native/conversation";
import InboxExample from "../../registry/examples/chat/native/inbox";
import { nativeFrame } from "./story-frame";

/** Native — Chat. Each story renders a named example of the registry (`registry/examples/chat/native/*`). */
const meta = { title: "Native/Chat", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Conversation: Story = { render: () => <ConversationExample /> };
export const Inbox: Story = { render: () => <InboxExample /> };
export const Assistant: Story = { render: () => <AssistantExample /> };
