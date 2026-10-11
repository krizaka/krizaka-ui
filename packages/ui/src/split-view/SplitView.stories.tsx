import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyExample from "../../registry/examples/split-view/empty";
import MessagesExample from "../../registry/examples/split-view/messages";
import { SplitView } from "./split-view";

/** Split view — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/SplitView",
  component: SplitView,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SplitView>;
export default meta;

type Story = StoryObj;

export const Messages: Story = { render: () => <MessagesExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const MessagesPhone: Story = { render: () => <MessagesExample />, parameters: { phone: true } };
export const Empty: Story = { render: () => <EmptyExample /> };
