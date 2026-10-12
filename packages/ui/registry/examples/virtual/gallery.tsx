"use client";

import { VirtualGrid } from "@krizaka/ui/virtual";

type Clip = { id: string; title: string; minutes: number };
const clips: Clip[] = Array.from({ length: 50_000 }, (_, i) => ({ id: `c${i}`, title: `Clip ${i + 1}`, minutes: 1 + (i % 12) }));

// A gallery of 50,000 clips: as many columns as the width allows, only the rows in view rendered.
export default function VirtualGallery() {
  return (
    <VirtualGrid
      items={clips}
      getKey={(c) => c.id}
      estimateRowHeight={148}
      minItemWidth={160}
      gap={12}
      height={420}
      label="Clips"
      renderItem={(c) => (
        <article className="flex flex-col gap-2">
          <div className="aspect-video rounded-lg bg-surface-3" aria-hidden />
          <p className="truncate text-sm font-semibold text-fg">{c.title}</p>
          <p className="text-xs text-fg-secondary">{c.minutes} min</p>
        </article>
      )}
    />
  );
}
