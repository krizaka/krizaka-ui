import { DayStrip } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const sessions = new Set(["2026-10-14", "2026-10-17"]);

// The days ahead, swiped sideways: Sundays closed, the days with a session marked.
export default function NativeDatePickerDayStrip() {
  const [day, setDay] = React.useState<string | null>("2026-10-14");
  return (
    <View style={{ width: 320 }}>
      <DayStrip
        label="Session day"
        locale="en-US"
        value={day}
        onValueChange={setDay}
        start="2026-10-11"
        today="2026-10-11"
        days={10}
        isDateDisabled={(d) => new Date(`${d}T12:00:00`).getDay() === 0}
        isDateMarked={(d) => sessions.has(d)}
        markedLabel="has a session"
      />
    </View>
  );
}
