"use client";

import { DatePicker } from "@krizaka/ui/date-picker";
import * as React from "react";

// `today` is fixed here for the documentation; leave it out in an app.
export default function DatePickerSchedule() {
  const [date, setDate] = React.useState<string | null>("2026-10-14");
  return (
    <DatePicker
      label="Publish on"
      locale="en-US"
      value={date}
      onValueChange={setDate}
      min="2026-10-11"
      today="2026-10-11"
      clearable
      placeholder="Publish now"
      hint="Your followers are told when it goes live."
    />
  );
}
