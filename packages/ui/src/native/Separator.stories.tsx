import type { Meta, StoryObj } from "@storybook/react-vite";

import RowsExample from "../../registry/examples/separator/native/rows";
import { nativeFrame } from "./story-frame";

/** Native — a hairline between rows, horizontal or vertical. Each story renders a named example of the registry (`registry/examples/separator/native/*`). */
const meta = {
  title: "Native/Separator",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = { render: () => <RowsExample /> };
