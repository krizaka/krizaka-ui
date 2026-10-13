import type { Meta, StoryObj } from "@storybook/react-vite";

import BirthDateExample from "../../registry/examples/date-picker/birth-date";
import BirthDateWheelExample from "../../registry/examples/date-picker/birth-date-wheel";
import CalendarExample from "../../registry/examples/date-picker/calendar";
import DayStripExample from "../../registry/examples/date-picker/day-strip";
import FrenchExample from "../../registry/examples/date-picker/french";
import MonthYearExample from "../../registry/examples/date-picker/month-year";
import OpenExample from "../../registry/examples/date-picker/open";
import RangeExample from "../../registry/examples/date-picker/range";
import ScheduleExample from "../../registry/examples/date-picker/schedule";
import TimeSlotsExample from "../../registry/examples/date-picker/time-slots";
import TimeWheelExample from "../../registry/examples/date-picker/time-wheel";
import WheelExample from "../../registry/examples/date-picker/wheel";

/**
 * DatePicker and the dates and times: each story renders a named example of the registry
 * (`registry/examples/date-picker/*`) — the code krizaka.com/docs/ui shows.
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
export const MonthYear: Story = { render: () => <MonthYearExample /> };
export const DayStrip: Story = { render: () => <DayStripExample /> };
export const Wheel: Story = { render: () => <WheelExample /> };
export const TimeWheel: Story = { render: () => <TimeWheelExample /> };
export const TimeSlots: Story = { render: () => <TimeSlotsExample /> };
export const BirthDate: Story = { render: () => <BirthDateExample /> };
export const BirthDateWheel: Story = { render: () => <BirthDateWheelExample /> };
