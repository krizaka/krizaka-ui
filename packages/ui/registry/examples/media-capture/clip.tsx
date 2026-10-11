"use client";

import { MediaCapture } from "@krizaka/ui/media-capture";

// A photo or a clip of 60 seconds at most, for a story; the blob goes to the upload queue.
export default function MediaCaptureClip() {
  return (
    <div className="w-72">
      <MediaCapture
        mode="both"
        maxDuration={60}
        aspectRatio="9 / 16"
        onCapture={(result) => console.info(result.kind, result.blob.size)}
        labels={{ prompt: "Film a story of up to 60 seconds, or take a photo." }}
      />
    </div>
  );
}
