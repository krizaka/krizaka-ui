"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

export default function CountdownHours() {
  // One hour, two minutes and three seconds from the first render.
  const [target] = useState(() => Date.now() + 3_723_000);
  return <Countdown target={target} units={{ d: "d", h: "h", m: "m", s: "s" }} label="Ends in" />;
}
