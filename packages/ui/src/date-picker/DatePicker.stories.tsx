import type { Meta, StoryObj } from "@storybook/react-vite";

import CalendarExample from "../../registry/examples/date-picker/calendar";
import FrenchExample from "../../registry/examples/date-picker/french";
import OpenExample from "../../registry/examples/date-picker/open";
import RangeExample from "../../registry/examples/date-picker/range";
import ScheduleExample from "../../registry/examples/date-picker/schedule";

/**
 * DatePicker: each story renders a named example of the registry (`registry/examples/date-picker/*`) — the code
 * krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/DatePicker",
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Schedule: Story = { render: () => <ScheduleExample /> };
export const Open: Story = { render: () => <OpenExample defaultOpen />, parameters: { capture: "viewport" } };
export const Range: Story = { render: () => <RangeExample defaultOpen />, parameters: { capture: "viewport" } };
export const French: Story = { render: () => <FrenchExample /> };
export const Calendar: Story = { render: () => <CalendarExample /> };
