"use client";

import { Calendar } from "@krizaka/ui/date-picker";
import * as React from "react";

const weekend = (iso: string) => [0, 6].includes(new Date(`${iso}T12:00:00`).getDay());

// The month is the interface: pick a day for a call, weekends unavailable.
export default function DatePickerCalendar() {
  const [day, setDay] = React.useState("2026-10-15");
  return (
    <div className="inline-block rounded-xl border border-border-default bg-surface-1 p-3">
      <Calendar locale="en-GB" value={day} onSelect={setDay} isDateDisabled={weekend} min="2026-10-12" today="2026-10-11" />
    </div>
  );
}
