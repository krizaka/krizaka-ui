"use client";

import { Wheel, WheelPicker } from "@krizaka/ui/date-picker";
import * as React from "react";

const sizes = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: i === 0 ? "1 guest" : `${i + 1} guests` }));

// Any short list turned by the thumb: a party size. The keyboard moves it too (↑ ↓, Page Up / Down, Home / End).
export default function DatePickerWheel() {
  const [size, setSize] = React.useState("4");
  return (
    <WheelPicker label="Party size">
      <Wheel label="Guests" options={sizes} value={size} onValueChange={setSize} className="w-36" />
    </WheelPicker>
  );
}
