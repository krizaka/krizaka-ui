"use client";

/* One line to copy, in one press: a component page's import, under its badges (the install line and the styles stay in
   « Installation »). The button says it worked (the Button's success status, announced) and rests again. */

import { Button } from "@krizaka/ui/button";
import { useEffect, useRef, useState } from "react";

// @fixed: how long « Copied » stays — a feedback rhythm, not a business delay.
const COPIED_MS = 1600;

export function CopyLine({ code, label, copy, copied }: { code: string; label: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), COPIED_MS);
  };
  return (
    <div className="kz-copy-line not-prose" role="group" aria-label={label}>
      <code>{code}</code>
      <Button type="button" variant="ghost" size="sm" onClick={onCopy} status={done ? "success" : null} announce={done ? copied : undefined}>
        {done ? copied : copy}
      </Button>
    </div>
  );
}
