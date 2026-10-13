import { Calendar } from "@krizaka/ui/native";
import * as React from "react";

// A month to book a day: 44-pt days, today's node, the past unavailable.
export default function NativeDatePickerCalendar() {
  const [day, setDay] = React.useState("2026-10-15");
  return <Calendar locale="en-US" value={day} onSelect={setDay} min="2026-10-11" today="2026-10-11" />;
}
