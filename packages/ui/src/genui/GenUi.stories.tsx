import type { Meta, StoryObj } from "@storybook/react-vite";

import StreamingExample from "../../registry/examples/genui/streaming";
import TableExample from "../../registry/examples/genui/table";
import { baseGenUiCatalog } from "./catalog";
import { GenUiStream } from "./surface";

/**
 * A model's answer drawn as an interface (A2UI v0.9, ADR-082): the prose, then the surfaces of its `a2ui` fence, built
 * from the catalog the app passes — never from code. Each story renders a named example of the registry
 * (`registry/examples/genui/*`): the code ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/GenUi",
  component: GenUiStream,
  args: { text: "", catalog: baseGenUiCatalog },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GenUiStream>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Table: Story = { render: () => <TableExample /> };
export const Streaming: Story = { render: () => <StreamingExample /> };
