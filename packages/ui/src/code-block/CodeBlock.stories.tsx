import type { Meta, StoryObj } from "@storybook/react-vite";

import AnnotatedExample from "../../registry/examples/code-block/annotated";
import BuildToolsExample from "../../registry/examples/code-block/build-tools";
import FileExample from "../../registry/examples/code-block/file";
import { CodeBlock } from "./code-block";

/** Code block — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/CodeBlock",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;
export default meta;

type Story = StoryObj;

export const File: Story = { render: () => <FileExample /> };
export const BuildTools: Story = { render: () => <BuildToolsExample /> };
export const Annotated: Story = { render: () => <AnnotatedExample /> };
