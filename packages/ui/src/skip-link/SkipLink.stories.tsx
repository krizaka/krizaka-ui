import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/skip-link/default";
import { SkipLink } from "./skip-link";

/** A "skip to content" link, hidden until focused. Each story renders a named example (`registry/examples/skip-link/*`). */
const meta = {
  title: "Primitives/SkipLink",
  component: SkipLink,
  args: { children: "Skip to content" },
} satisfies Meta<typeof SkipLink>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
