import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { DropdownMenu } from "./dropdown-menu";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

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
export const Open: Story = {
  render: (args) => (
    <DropdownMenu.Root defaultOpen modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args} align="center">
        <DropdownMenu.Label>Video</DropdownMenu.Label>
        <DropdownMenu.Item>{icon("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z")}Edit</DropdownMenu.Item>
        <DropdownMenu.Item>{icon("M4 12v8h16v-8M16 6l-4-4-4 4M12 2v13")}Share</DropdownMenu.Item>
        <DropdownMenu.Item disabled>{icon("M12 3v12M7 10l5 5 5-5M5 21h14")}Download</DropdownMenu.Item>
        <DropdownMenu.CheckboxItem checked>Pinned to the profile</DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger">{icon("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6")}Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};
