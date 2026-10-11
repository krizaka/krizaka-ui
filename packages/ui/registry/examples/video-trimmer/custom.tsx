"use client";

import { VideoTrimmer } from "@krizaka/ui/video-trimmer";

const BARS = Array.from({ length: 64 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.7)) * 0.75);

// Every part takes its own classes: thin handles, a shorter track, a waveform as its content.
export default function VideoTrimmerCustom() {
  return (
    <VideoTrimmer
      duration={180}
      defaultValue={[42, 96]}
      step={1}
      largeStep={10}
      classNames={{ track: "h-12 bg-surface-1", handle: "w-3 bg-fg-accent", range: "border-y-2 border-fg-accent" }}
      renderHandle={() => <span className="h-5 w-0.5 rounded-full bg-surface-0" />}
      labels={{ start: "Start of the extract", end: "End of the extract", kept: (length) => `Extract: ${length}` }}
    >
      <div className="flex h-full w-full items-center gap-[2px] px-1">
        {BARS.map((peak, i) => (
          <span key={i} className="flex-1 rounded-full bg-border-strong" style={{ height: `${peak * 80}%` }} />
        ))}
      </div>
    </VideoTrimmer>
  );
}
