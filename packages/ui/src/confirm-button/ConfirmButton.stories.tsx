import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import ConfirmButtonDemo from "../../registry/demos/confirm-button";
import { ConfirmButton } from "./confirm-button";

function Trash() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

/**
 * `ConfirmButton`: a destructive action in two presses, never `window.confirm`. The first arms it and says what will
 * happen (`confirmLabel`, announced politely), the second runs `onConfirm`; `timeoutMs`, Escape and a blur disarm it.
 * Takes the `Button` variants (`ghost` by default).
 */
const meta = {
  title: "Primitives/ConfirmButton",
  component: ConfirmButton,
  args: { label: "Delete the comment", confirmLabel: "Delete?", onConfirm: () => {}, size: "sm", children: <Trash /> },
} satisfies Meta<typeof ConfirmButton>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Idle: an icon, named by `label`. The demo of the registry (`registry/demos/confirm-button.tsx`). */
export const Idle: Story = { render: () => <ConfirmButtonDemo /> };

/** Armed after the first press: the danger border and tint, the words legible. */
export const Armed: Story = {
  args: { timeoutMs: 600_000 },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("data-armed");
  },
};

/** With words: the armed content replaces them (`armedContent`). */
export const WithText: Story = {
  args: { variant: "outline", size: "md", label: undefined, children: "Leave the group", confirmLabel: "Leave for good?", armedContent: "Leave for good?" },
};
