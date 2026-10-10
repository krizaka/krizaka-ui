"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

// Under `urgentBelowMs` (one minute by default): the danger role, the last segment pulses.
export default function CountdownUrgent() {
  const [target] = useState(() => Date.now() + 42_000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" />;
}
