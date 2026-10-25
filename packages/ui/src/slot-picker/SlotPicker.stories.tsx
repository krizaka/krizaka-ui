import type { Meta, StoryObj } from "@storybook/react-vite";

import TimesExample from "../../registry/examples/slot-picker/times";
import WeeksExample from "../../registry/examples/slot-picker/weeks";

/** SlotPicker. Each story renders a named example of the registry (`registry/examples/slot-picker/*`). */
const meta = { title: "Primitives/SlotPicker", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Times: Story = { render: () => <TimesExample /> };
export const TimesPhone: Story = { render: () => <TimesExample />, parameters: { phone: true } };
export const Weeks: Story = { render: () => <WeeksExample /> };
export const WeeksPhone: Story = { render: () => <WeeksExample />, parameters: { phone: true } };
