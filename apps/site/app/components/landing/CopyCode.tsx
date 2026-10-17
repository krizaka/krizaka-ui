"use client";

/* A tile's "Code" action: copies the exact source of the example the tile renders (read from the registry at build),
   says so for two seconds (visibly and to assistive technology), and keeps the way to the component's page beside it. */

import { CheckIcon, CopyIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { useEffect, useState } from "react";

export function CopyCode({ code, label, idle, done }: { code: string; label: string; idle: string; done: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      shape="pill"
      className="kz-land-copy"
      aria-label={label}
      data-copied={copied ? "" : undefined}
      onClick={() => void navigator.clipboard?.writeText(code).then(() => setCopied(true), () => undefined)}
    >
      {copied ? <CheckIcon size={14} aria-hidden /> : <CopyIcon size={14} aria-hidden />}
      <span aria-live="polite">{copied ? done : idle}</span>
    </Button>
  );
}
