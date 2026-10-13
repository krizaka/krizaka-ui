"use client";

import { TimePicker, timeSlots } from "@krizaka/ui/date-picker";
import * as React from "react";

const taken = new Set(["10:00", "13:30", "14:00"]);

// The free times of an agenda, by part of the day; taken slots are struck through and skipped by the arrows.
export default function DatePickerTimeSlots() {
  const [time, setTime] = React.useState<string | null>("11:00");
  return (
    <div className="w-full max-w-md">
      <TimePicker
        variant="slots"
        label="Appointment time"
        locale="en-US"
        slots={timeSlots("09:00", "17:00", 30)}
        isTimeDisabled={(t) => taken.has(t)}
        groupLabels={{ morning: "Morning", afternoon: "Afternoon", evening: "Evening" }}
        value={time}
        onValueChange={setTime}
      />
    </div>
  );
}
