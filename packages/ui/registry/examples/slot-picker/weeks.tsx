"use client";
import { type PickerDay, SlotPicker } from "@krizaka/ui/slot-picker";
import * as React from "react";

// A fictitious shop: the host loads the days of the week it is asked for; the picker only shows them.
const t = (id: string, label: string, note?: string, disabled?: boolean) => ({ id, label, note, disabled });
const am = [t("a", "9:00 AM"), t("b", "9:45 AM", "Full", true), t("c", "10:30 AM")];
const day = (id: string, label: string, sub: string, pm: PickerDay["slots"]): PickerDay => ({
  id, label, sub, groups: [{ id: "am", label: "Morning", slots: am.map((s) => ({ ...s, id: id + s.id })) }, { id: "pm", label: "Afternoon", slots: pm ?? [] }],
});
const WEEKS: Record<string, { label: string; days: PickerDay[] }> = {
  "2026-10-19": { label: "Oct 19 – 25", days: [day("20", "Tue", "Oct 20", [t("20p", "2:00 PM"), t("20q", "3:30 PM", "1 spot left")])] },
  "2026-10-26": { label: "Oct 26 – Nov 1", days: [day("27", "Tue", "Oct 27", [t("27p", "1:00 PM")])] },
  "2026-11-02": { label: "Nov 2 – 8", days: [] },
};

export default function SlotPickerWeeks() {
  const [week, setWeek] = React.useState("2026-10-19");
  const [value, setValue] = React.useState<string | null>("20c");
  const data = WEEKS[week] ?? { label: week, days: [] };
  return (
    <SlotPicker
      label="Available times" emptyLabel="Nothing free this week — try the next one." days={data.days} value={value} onValueChange={setValue}
      week={week} onWeekChange={setWeek} minWeek="2026-10-19" maxWeek="2026-11-02" todayWeek="2026-10-19" weekLabel={data.label}
      weekButtons={{ previous: "Previous week", today: "Today", next: "Next week" }} footer="Montréal (UTC−4) · 45 min"
    />
  );
}
