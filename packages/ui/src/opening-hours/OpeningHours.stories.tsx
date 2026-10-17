import type { Meta, StoryObj } from "@storybook/react-vite";

import WeekExample from "../../registry/examples/opening-hours/week";

/** OpeningHours. Each story renders a named example of the registry (`registry/examples/opening-hours/*`). */
const meta = { title: "Primitives/OpeningHours", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Week: Story = { render: () => <WeekExample /> };
export const WeekPhone: Story = { render: () => <WeekExample />, parameters: { phone: true } };
