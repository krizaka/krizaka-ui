"use client";
import { Button } from "@krizaka/ui/button";
import { useEffect, useState } from "react";

// An export with a known length: the trace and a light fill grow across the button; it keeps its width and colour.
// “Run it” plays the export from the start.
export default function ButtonUploadProgress() {
  const [progress, setProgress] = useState(0.65);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || progress >= 1) return;
    const timer = setTimeout(() => setProgress((p) => Math.min(1, p + 0.15)), 700);
    return () => clearTimeout(timer);
  }, [running, progress]);
  const done = progress >= 1;
  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" loading={!done} progress={progress} status={done ? "success" : null}>
        {done ? "Exported" : `Exporting ${Math.round(progress * 100)} %`}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => (setProgress(0.05), setRunning(true))}>
        Run it
      </Button>
    </div>
  );
}
