import { Countdown } from "@krizaka/ui/native";
import { useState } from "react";

export default function NativeCountdownUrgent() {
  const [target] = useState(() => Date.now() + 42_000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" size="lg" />;
}
