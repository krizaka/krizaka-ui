import { DateField } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const latestAdult = () => {
  const today = new Date();
  return new Date(Date.UTC(today.getFullYear() - 18, today.getMonth(), today.getDate())).toISOString().slice(0, 10);
};

// A date of birth typed as day, month and year, in the locale's order; an under-18 date is refused at once.
export default function NativeDateFieldBirthDate() {
  const [birth, setBirth] = React.useState("2015-03-27");
  const minor = /^\d{4}-\d{2}-\d{2}$/.test(birth) && birth > latestAdult();
  return (
    <View style={{ width: 296 }}>
      <DateField
        label="Date of birth"
        locale="en-GB"
        autoComplete="bday"
        value={birth}
        onValueChange={setBirth}
        hint="Private, never shown. For example, 27 3 1990."
        error={minor ? "You must be 18 or older to create an account." : undefined}
      />
    </View>
  );
}
