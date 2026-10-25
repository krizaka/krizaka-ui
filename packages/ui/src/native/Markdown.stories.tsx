import type { Meta, StoryObj } from "@storybook/react-vite";

import AiStreamExample from "../../registry/examples/markdown/native/ai-stream";
import BasicExample from "../../registry/examples/markdown/native/basic";
import WideTableExample from "../../registry/examples/markdown/native/wide-table";
import { Markdown } from "./markdown";
import { nativeFrame } from "./story-frame";

/**
 * Native — Markdown, drawn in Text and View through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/markdown/native/*`).
 */
const meta = {
  title: "Native/Markdown",
  component: Markdown,
  decorators: [nativeFrame],
  args: { children: "" },
} satisfies Meta<typeof Markdown>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
export const AiStream: Story = { render: () => <AiStreamExample /> };
export const WideTable: Story = { render: () => <WideTableExample />, parameters: { phone: true, noOverflow: true } };
