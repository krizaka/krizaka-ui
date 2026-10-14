import type { Meta, StoryObj } from "@storybook/react-vite";

import GlobalExample from "../../registry/examples/search-field/global";
import SuggestionsExample from "../../registry/examples/search-field/suggestions";
import ToolbarExample from "../../registry/examples/search-field/toolbar";

/**
 * SearchField: each story renders a named example of the registry (`registry/examples/search-field/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/SearchField",
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Global: Story = { render: () => <GlobalExample /> };
export const Suggestions: Story = { render: () => <SuggestionsExample /> };
export const Toolbar: Story = { render: () => <ToolbarExample /> };
