import type { Meta, StoryObj } from "@storybook/react-vite";

import AsyncExample from "../../registry/examples/combobox/async";
import CreatableExample from "../../registry/examples/combobox/creatable";
import InvalidExample from "../../registry/examples/combobox/invalid";
import MultipleExample from "../../registry/examples/combobox/multiple";

/**
 * Combobox: each story renders a named example of the registry (`registry/examples/combobox/*`) — the code
 * krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Combobox",
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Async: Story = { render: () => <AsyncExample /> };
export const Multiple: Story = { render: () => <MultipleExample /> };
export const Creatable: Story = { render: () => <CreatableExample /> };
export const Invalid: Story = { render: () => <InvalidExample /> };
