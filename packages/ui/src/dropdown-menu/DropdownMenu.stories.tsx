import type { Meta, StoryObj } from "@storybook/react-vite";

import ActionsExample from "../../registry/examples/dropdown-menu/actions";
import { DropdownMenu } from "./dropdown-menu";

/**
 * `DropdownMenu` on Radix: the arrows, Home/End, typeahead, Escape and the focus return come from Radix. The story
 * renders the registry's example (`registry/examples/dropdown-menu/actions.tsx`), open at load.
 */
const meta = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu.Content,
  parameters: { capture: "viewport" },
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu.Content>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Actions: Story = { render: () => <ActionsExample defaultOpen /> };
