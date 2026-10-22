import type { Meta, StoryObj } from "@storybook/react-vite";

import DayExample from "../../registry/examples/agenda/day";

/** Agenda. Each story renders a named example of the registry (`registry/examples/agenda/*`). */
const meta = { title: "Primitives/Agenda", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Day: Story = { render: () => <DayExample /> };
export const DayPhone: Story = { render: () => <DayExample />, parameters: { phone: true } };
