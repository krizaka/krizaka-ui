"use client";

import { DateField, isRealDate, latestBirthDate } from "@krizaka/ui/date-picker";
import * as React from "react";

// A date of birth typed as day, month and year (the browser can fill it); an under-18 date is refused at once.
export default function DatePickerBirthDate() {
  const [birth, setBirth] = React.useState("2015-03-27");
  const minor = isRealDate(birth) && birth > latestBirthDate(18);
  return (
    <DateField
      label="Date of birth"
      locale="en-GB"
      autoComplete="bday"
      value={birth}
      onValueChange={setBirth}
      hint="Private, never shown. For example, 27 3 1990."
      error={minor ? "You must be 18 or older to create an account." : undefined}
    />
  );
}
