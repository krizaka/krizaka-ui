"use client";

import { DayStrip } from "@krizaka/ui/date-picker";
import * as React from "react";

const closed = (iso: string) => new Date(`${iso}T12:00:00`).getDay() === 0;
const sessions = new Set(["2026-10-14", "2026-10-17", "2026-10-21"]);

// The next two weeks in a row: Sundays closed, the days with a session marked.
export default function DatePickerDayStrip() {
  const [day, setDay] = React.useState<string | null>("2026-10-14");
  return (
    <div className="w-full max-w-md">
      <DayStrip
        label="Session day"
        locale="en-US"
        value={day}
        onValueChange={setDay}
        start="2026-10-11"
        today="2026-10-11"
        isDateDisabled={closed}
        isDateMarked={(d) => sessions.has(d)}
        labels={{ marked: "has a session" }}
      />
    </div>
  );
}
