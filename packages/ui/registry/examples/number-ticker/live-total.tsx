"use client";

import { Button } from "@krizaka/ui/button";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { useState } from "react";

// A live total (an auction's highest bid): each digit rolls to the new value, a rise flashes the success colour, and the
// new amount is announced politely.
export default function NumberTickerLiveTotal() {
  const [bid, setBid] = useState(1250);
  return (
    <div className="flex items-center gap-4">
      <p className="font-display text-3xl font-semibold text-fg">
        <NumberTicker value={bid} trigger="change" announce locale="en" format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} />
      </p>
      <Button size="sm" variant="primary" onClick={() => setBid((b) => b + 50)}>
        Outbid by €50
      </Button>
    </div>
  );
}
