"use client";

import { DateWheel } from "@krizaka/ui/date-picker";
import * as React from "react";

// The wheels of a date of birth, in the locale's order, ending at the 18th birthday: an under-18 date cannot be chosen.
// `max` is fixed here for the documentation; in an app, `max={latestBirthDate(18)}`.
export default function DatePickerBirthDateWheel() {
  const [birth, setBirth] = React.useState<string | null>("1994-06-18");
  return <DateWheel label="Date of birth" locale="en-US" value={birth} onValueChange={setBirth} max="2008-10-11" hint="You must be 18 or older." />;
}
