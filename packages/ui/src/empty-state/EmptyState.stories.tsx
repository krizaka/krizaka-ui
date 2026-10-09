import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyStateDemo from "../../registry/demos/empty-state";
import { Button } from "../button/button";
import { EmptyState } from "./empty-state";

const Icon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m10 9 5 3-5 3z" />
  </svg>
);

/** What a list, a search or a panel says when it has nothing to show (`role="status"`). Every word is a prop. */
const meta = {
  title: "Primitives/EmptyState",
  component: EmptyState,
  args: { title: "No videos yet", description: "The videos you publish appear here." },
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

/** The demo of the registry (`registry/demos/empty-state.tsx`). */
export const Default: Story = { render: () => <EmptyStateDemo /> };

/** With what to do next. */
export const WithAction: Story = {
  args: {
    icon: Icon,
    action: (
      <Button variant="primary" size="sm">
        Publish a video
      </Button>
    ),
  },
};

/** A title alone. */
export const TitleOnly: Story = { args: { description: undefined, title: "No results" } };
