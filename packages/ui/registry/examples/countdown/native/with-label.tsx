import { Countdown } from "@krizaka/ui/native";
import { useState } from "react";

export default function NativeCountdownWithLabel() {
  const [target] = useState(() => Date.now() + 3_723_000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" showLabel />;
}
