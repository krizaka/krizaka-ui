"use client";
import { SlotPicker } from "@krizaka/ui/slot-picker";
import * as React from "react";

const at = (id: string, label: string, note?: string) => ({ id, label, note });

// The next free times by day; the reader presses one (or each time is a link to the booking page).
export default function SlotPickerTimes() {
  const [value, setValue] = React.useState<string | null>("mon-0930");
  return (
    <SlotPicker
      label="Available times"
      emptyLabel="No time is free in the next two weeks."
      value={value}
      onValueChange={setValue}
      days={[
        { id: "mon", label: "Today", sub: "Oct 19", slots: [at("mon-0930", "9:30 AM"), at("mon-1000", "10:00 AM", "2 spots"), at("mon-1330", "1:30 PM")] },
        { id: "tue", label: "Tue", sub: "Oct 20", slots: [at("tue-0800", "8:00 AM"), at("tue-1400", "2:00 PM")] },
        { id: "wed", label: "Wed", sub: "Oct 21", slots: [at("wed-0900", "9:00 AM")] },
      ]}
    />
  );
}
