import type { Meta, StoryObj } from "@storybook/react-vite";

import DropdownMenuDemo from "../../registry/demos/dropdown-menu";
import { DropdownMenu } from "./dropdown-menu";

/**
 * `DropdownMenu.Root/Trigger/Content/Item/CheckboxItem/Label/Separator/Group` on Radix: the arrows, Home/End,
 * typeahead, Escape and the focus return come from Radix. `tone="danger"` marks a destructive item (the icon and the
 * highlight carry the danger, the label stays legible).
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

/** Open at load: a label, actions with icons, a checkbox item, a separator, a destructive item. */
export const Open: Story = { render: () => <DropdownMenuDemo defaultOpen /> };
