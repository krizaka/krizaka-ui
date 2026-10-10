import type { Meta, StoryObj } from "@storybook/react-vite";

import SecondaryExample from "../../registry/examples/theme/secondary";
import ToggleExample from "../../registry/examples/theme/toggle";
import { ThemeToggle } from "./theme";

/**
 * `ThemeToggle` cycles dark → light → system through `ThemeProvider`. Clicking it here changes the catalogue's theme too.
 * Each story renders a named example of the registry (`registry/examples/theme/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/ThemeToggle",
  component: ThemeToggle,
  args: { label: "Change the theme" },
} satisfies Meta<typeof ThemeToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = { render: () => <ToggleExample /> };
export const Secondary: Story = { render: () => <SecondaryExample /> };
