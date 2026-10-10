"use client";

import { Countdown } from "@krizaka/ui/countdown";
import { useState } from "react";

const units = { d: "d", h: "h", m: "m", s: "s" };

export default function CountdownSizes() {
  const [target] = useState(() => Date.now() + 3_723_000);
  return (
    <div className="flex flex-col items-start gap-3">
      <Countdown target={target} units={units} label="Ends in" size="sm" />
      <Countdown target={target} units={units} label="Ends in" size="md" />
      <Countdown target={target} units={units} label="Ends in" size="lg" />
    </div>
  );
}
