"use client";

import { CopyButton } from "@krizaka/ui/copy-button";

export default function CopyButtonDefault() {
  return <CopyButton value="https://example.com/r/ABC123" label="Copy link" copiedLabel="Copied" fallbackLabel="Select and copy the link" />;
}
