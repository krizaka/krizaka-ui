import type { Meta, StoryObj } from "@storybook/react-vite";

import StorageExample from "../../registry/examples/treemap/storage";
import { chartFrame } from "./frame";

/** Treemap. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/Treemap", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Storage: Story = { render: () => <StorageExample /> };
