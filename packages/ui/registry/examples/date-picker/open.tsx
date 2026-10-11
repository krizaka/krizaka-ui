"use client";

import { DatePicker } from "@krizaka/ui/date-picker";

// The calendar open: today marked, the chosen day filled, the past unavailable.
export default function DatePickerOpen({ defaultOpen }: { defaultOpen?: boolean }) {
  return <DatePicker label="Auction ends" locale="en-US" defaultValue="2026-10-18" min="2026-10-11" today="2026-10-11" defaultOpen={defaultOpen} />;
}
