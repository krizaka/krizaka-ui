"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

// Days appear when there are some: days, hours, minutes.
export default function CountdownDays() {
  const [target] = useState(() => Date.now() + ((2 * 24 + 4) * 3600 + 13 * 60) * 1000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" />;
}
