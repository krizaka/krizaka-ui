import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/empty-state/default";
import TitleOnlyExample from "../../registry/examples/empty-state/title-only";
import WithActionExample from "../../registry/examples/empty-state/with-action";
import { EmptyState } from "./empty-state";

/**
 * What a list, a search or a panel says when it has nothing to show (`role="status"`). Each story renders a named
 * example of the registry (`registry/examples/empty-state/*`).
 */
const meta = {
  title: "Primitives/EmptyState",
  component: EmptyState,
  args: { title: "No videos yet" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const WithAction: Story = { render: () => <WithActionExample /> };
export const TitleOnly: Story = { render: () => <TitleOnlyExample /> };
