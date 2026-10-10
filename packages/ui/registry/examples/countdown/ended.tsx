"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

// Past the target: zeros and `data-ended`. Say what happens next next to it.
export default function CountdownEnded() {
  const [target] = useState(() => Date.now() - 1000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ended" />;
}
