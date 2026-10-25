import type { Meta, StoryObj } from "@storybook/react-vite";

import AiStreamExample from "../../registry/examples/markdown/ai-stream";
import BasicExample from "../../registry/examples/markdown/basic";
import WideTableExample from "../../registry/examples/markdown/wide-table";
import { Markdown } from "./markdown";

/** Markdown — TanStack Markdown's AST on the tokens. Each story renders a named example of the registry. */
const meta = {
  title: "Primitives/Markdown",
  component: Markdown,
  args: { children: "" },
} satisfies Meta<typeof Markdown>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
/** The answer rests mid-sentence: the open `**` is closed and a caret marks the end (animations are off for the screenshot). */
export const AiStream: Story = { render: () => <AiStreamExample /> };
export const WideTable: Story = {
  render: () => <WideTableExample />,
  parameters: { phone: true, noOverflow: true },
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>(".kz-md-table")!;
    if (region.scrollWidth <= region.clientWidth) throw new Error("The wide table must scroll inside its frame.");
    for (const code of region.querySelectorAll("code")) {
      if (getComputedStyle(code).whiteSpace !== "nowrap") throw new Error("A table identifier must not wrap.");
    }
    for (const cell of region.querySelectorAll<HTMLElement>("th, td")) {
      if (cell.scrollWidth > cell.clientWidth + 1) throw new Error("An identifier must widen its column, not overlap the next cell.");
    }
  },
};
