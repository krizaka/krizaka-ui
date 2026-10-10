import { Countdown } from "@krizaka/ui/native";
import { useState } from "react";

const units = { d: "d", h: "h", m: "m", s: "s" };

export default function NativeCountdownSizes() {
  const [target] = useState(() => Date.now() + 3_723_000);
  return (
    <>
      <Countdown target={target} units={units} label="Ends in" size="sm" />
      <Countdown target={target} units={units} label="Ends in" size="md" />
      <Countdown target={target} units={units} label="Ends in" size="lg" />
    </>
  );
}
