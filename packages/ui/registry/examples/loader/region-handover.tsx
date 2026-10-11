"use client";
import { Button } from "@krizaka/ui/button";
import { LoadingRegion } from "@krizaka/ui/loader";
import { Skeleton } from "@krizaka/ui/skeleton";
import { useState } from "react";

// The region hands over: content → a skeleton of its shape → words when it lasts → the content, fading in.
export default function LoaderRegionHandover() {
  const [loading, setLoading] = useState(true);
  const card = "flex items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-4";
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <LoadingRegion
        loading={loading}
        label="Loading the creator"
        slowLabel="Still loading — the server is busy"
        slowAfter={2500}
        delay={0}
        skeleton={<div className={card}><Skeleton shape="circle" /><div className="flex flex-1 flex-col gap-2"><Skeleton className="w-1/2" /><Skeleton className="w-3/4" /></div></div>}
      >
        <div className={card}>
          <span aria-hidden className="h-10 w-10 rounded-full bg-accent-soft" />
          <div><p className="font-semibold text-fg">Eric Moreau</p><p className="text-sm text-fg-secondary">1,204 supporters</p></div>
        </div>
      </LoadingRegion>
      <Button size="sm" onClick={() => setLoading((l) => !l)}>{loading ? "Finish loading" : "Load again"}</Button>
    </div>
  );
}
