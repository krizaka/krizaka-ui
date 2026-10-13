import type { Meta, StoryObj } from "@storybook/react-vite";

import BirthDateExample from "../../registry/examples/date-picker/native/birth-date";
import BirthDateWheelExample from "../../registry/examples/date-picker/native/birth-date-wheel";
import CalendarExample from "../../registry/examples/date-picker/native/calendar";
import DayStripExample from "../../registry/examples/date-picker/native/day-strip";
import MonthYearExample from "../../registry/examples/date-picker/native/month-year";
import TimeSlotsExample from "../../registry/examples/date-picker/native/time-slots";
import TimeWheelExample from "../../registry/examples/date-picker/native/time-wheel";
import { nativeFrame } from "./story-frame";

/**
 * Native — the dates and times through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/date-picker/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/DatePicker",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const BirthDate: Story = { render: () => <BirthDateExample /> };
export const BirthDateWheel: Story = { render: () => <BirthDateWheelExample /> };
export const Calendar: Story = { render: () => <CalendarExample /> };
export const DayStrip: Story = { render: () => <DayStripExample /> };
export const TimeWheel: Story = { render: () => <TimeWheelExample /> };
export const TimeSlots: Story = { render: () => <TimeSlotsExample /> };
export const MonthYear: Story = { render: () => <MonthYearExample /> };
