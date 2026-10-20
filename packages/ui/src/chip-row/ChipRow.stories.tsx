import type { Meta, StoryObj } from "@storybook/react-vite";

import AudienceExample from "../../registry/examples/chip-row/audience";
import ManyExample from "../../registry/examples/chip-row/many";
import { ChipRow } from "./chip-row";

/** A scroll-snap row of chip links. Each story renders a named example of the registry. */
const meta = {
  title: "Primitives/ChipRow",
  component: ChipRow,
  args: { label: "For whom?" },
} satisfies Meta<typeof ChipRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Audience: Story = { render: () => <AudienceExample /> };
export const Many: Story = { render: () => <ManyExample />, parameters: { viewport: { defaultViewport: "mobile1" } } };
