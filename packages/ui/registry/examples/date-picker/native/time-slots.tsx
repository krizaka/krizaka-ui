import { TimePicker, timeSlots } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const taken = new Set(["10:00", "11:30"]);

// The free times of an agenda as buttons; taken ones dashed and struck through.
export default function NativeDatePickerTimeSlots() {
  const [time, setTime] = React.useState<string | null>("10:30");
  return (
    <View style={{ width: 320 }}>
      <TimePicker variant="slots" label="Appointment time" locale="en-US" slots={timeSlots("09:00", "12:00", 30)} isTimeDisabled={(t) => taken.has(t)} value={time} onValueChange={setTime} />
    </View>
  );
}
