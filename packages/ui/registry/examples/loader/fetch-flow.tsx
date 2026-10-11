"use client";
import { Button } from "@krizaka/ui/button";
import { Loader } from "@krizaka/ui/loader";
import { useState } from "react";

// Try both: a fast answer (150 ms) shows nothing at all; a slow one shows the wait, then a check, then nothing.
export default function LoaderFetchFlow() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const run = (ms: number) => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), ms);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => run(150)}>Fast answer</Button>
        <Button size="sm" onClick={() => run(2500)}>Slow answer</Button>
      </div>
      <div className="h-10">
        {status !== "idle" && <Loader status={status} label="Loading your invoices" successLabel="12 invoices loaded" />}
      </div>
    </div>
  );
}
