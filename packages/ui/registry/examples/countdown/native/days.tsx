import { Countdown } from "@krizaka/ui/native";
import { useState } from "react";

export default function NativeCountdownDays() {
  const [target] = useState(() => Date.now() + ((2 * 24 + 4) * 3600 + 13 * 60) * 1000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" />;
}
