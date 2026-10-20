import type { Meta, StoryObj } from "@storybook/react-vite";

import NotesExample from "../../registry/examples/footnote/notes";
import { Caption } from "./footnote";

/** Footnote & caption — the small print of the Cahier (ADR-004). Each story renders a named example. */
const meta = {
  title: "Blocks/Footnote",
  component: Caption,
} satisfies Meta<typeof Caption>;
export default meta;

type Story = StoryObj;

export const Notes: Story = { render: () => <NotesExample /> };
