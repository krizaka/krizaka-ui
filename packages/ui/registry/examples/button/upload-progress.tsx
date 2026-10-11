"use client";
import { Button } from "@krizaka/ui/button";
import { useEffect, useState } from "react";

// An export with a known length: the trace and a light fill grow across the button; it keeps its width and colour.
export default function ButtonUploadProgress() {
  const [progress, setProgress] = useState<number | null>(0.35);
  useEffect(() => {
    if (progress === null || progress >= 1) return;
    const timer = setTimeout(() => setProgress((p) => Math.min(1, (p ?? 0) + 0.15)), 700);
    return () => clearTimeout(timer);
  }, [progress]);
  const done = progress !== null && progress >= 1;
  return (
    <Button variant="secondary" loading={!done} progress={progress} status={done ? "success" : null} onClick={() => setProgress(0)}>
      {done ? "Exported — export again" : `Exporting ${Math.round((progress ?? 0) * 100)} %`}
    </Button>
  );
}
