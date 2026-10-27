"use client";

import { CopyButton } from "@krizaka/ui/copy-button";

export default function CopyButtonIconOnly() {
  return <CopyButton iconOnly size="sm" variant="ghost" value="KRZ-FOUNDER-39" label="Copy the code" copiedLabel="Copied" fallbackLabel="Select and copy the code" />;
}
