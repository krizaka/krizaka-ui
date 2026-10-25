"use client";
import { type PickerDay,SlotPicker } from "@krizaka/ui/slot-picker";
import * as React from "react";

// A fictitious shop (Atelier Eric, haircuts): the host loads the days of the week it is asked for; the picker only shows them.
const slot = (id: string, label: string, note?: string, disabled?: boolean) => ({ id, label, note, disabled });
const WEEKS: Record<string, { label: string; days: PickerDay[] }> = {
  "2026-10-19": {
    label: "Oct 19 – 25",
    days: [
      {
        id: "2026-10-20",
        label: "Tue",
        sub: "Oct 20",
        groups: [
          { id: "am", label: "Morning", slots: [slot("20-0900", "9:00 AM"), slot("20-0945", "9:45 AM", "Full", true), slot("20-1030", "10:30 AM")] },
          { id: "pm", label: "Afternoon", slots: [slot("20-1400", "2:00 PM"), slot("20-1530", "3:30 PM", "1 spot left")] },
        ],
      },
      { id: "2026-10-22", label: "Thu", sub: "Oct 22", groups: [{ id: "am", label: "Morning", slots: [slot("22-0900", "9:00 AM")] }] },
    ],
  },
  "2026-10-26": {
    label: "Oct 26 – Nov 1",
    days: [{ id: "2026-10-27", label: "Tue", sub: "Oct 27", groups: [{ id: "pm", label: "Afternoon", slots: [slot("27-1300", "1:00 PM"), slot("27-1445", "2:45 PM")] }] }],
  },
  "2026-11-02": { label: "Nov 2 – 8", days: [] },
};

export default function SlotPickerWeeks() {
  const [week, setWeek] = React.useState("2026-10-19");
  const [value, setValue] = React.useState<string | null>("20-1030");
  const data = WEEKS[week] ?? { label: week, days: [] };
  return (
    <SlotPicker
      label="Available times"
      emptyLabel="Nothing free this week — try the next one."
      days={data.days}
      value={value}
      onValueChange={setValue}
      week={week}
      onWeekChange={setWeek}
      minWeek="2026-10-19"
      maxWeek="2026-11-02"
      todayWeek="2026-10-19"
      weekLabel={data.label}
      weekButtons={{ previous: "Previous week", today: "Today", next: "Next week" }}
      footer="Montréal (UTC−4) · 45 min"
    />
  );
}
