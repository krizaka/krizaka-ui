"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

// `showLabel` writes the label before the segments (it stays the accessible name).
export default function CountdownWithLabel() {
  const [target] = useState(() => Date.now() + 3_723_000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" showLabel />;
}
