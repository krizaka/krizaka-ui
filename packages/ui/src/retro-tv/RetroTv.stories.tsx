import type { Meta, StoryObj } from "@storybook/react-vite";

import CabinetExample from "../../registry/examples/retro-tv/cabinet";
import PortableExample from "../../registry/examples/retro-tv/portable";

/** RetroTv: each story renders a named registry example. */
const meta = {
  title: "Primitives/RetroTv",
  tags: ["retro-tv"],
  decorators: [(Story) => <div className="mx-auto w-72 max-w-full"><Story /></div>],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Cabinet: Story = { render: () => <CabinetExample /> };
export const Portable: Story = { render: () => <PortableExample /> };
