import { DateWheel } from "@krizaka/ui/native";
import * as React from "react";

// The wheels of a date of birth in the locale's order, ending at the 18th birthday; each value passed ticks under the
// thumb (the app's `haptics`). `max` is fixed here for the documentation; in an app, `max={latestBirthDate(18)}`.
export default function NativeDatePickerBirthDateWheel() {
  const [birth, setBirth] = React.useState<string | null>("1994-06-18");
  return <DateWheel label="Date of birth" locale="en-US" value={birth} onValueChange={setBirth} max="2008-10-11" hint="You must be 18 or older." />;
}
