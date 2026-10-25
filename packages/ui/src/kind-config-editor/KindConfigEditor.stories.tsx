import type { Meta, StoryObj } from "@storybook/react-vite";

import DerivedExample from "../../registry/examples/kind-config-editor/derived";
import StatusSetExample from "../../registry/examples/kind-config-editor/status-set";
import TagSetExample from "../../registry/examples/kind-config-editor/tag-set";

/** The admin's editors of a kind's tags and statuses (#690). Each story renders a named example of the registry (`registry/examples/kind-config-editor/*`). */
const meta = {
  title: "Forms/KindConfigEditor",
  decorators: [
    (Story) => (
      <div className="w-[44rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const TagSet: Story = { render: () => <TagSetExample /> };
export const TagSetPhone: Story = { render: () => <TagSetExample />, parameters: { phone: true } };
export const StatusSet: Story = { render: () => <StatusSetExample /> };
export const StatusSetPhone: Story = { render: () => <StatusSetExample />, parameters: { phone: true } };
export const Derived: Story = { render: () => <DerivedExample /> };
