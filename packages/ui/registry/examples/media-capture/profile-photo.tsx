"use client";

import { MediaCapture } from "@krizaka/ui/media-capture";
import * as React from "react";

// The front camera, a photo; the browser asks only when the button is pressed.
export default function MediaCaptureProfilePhoto() {
  const [photo, setPhoto] = React.useState<string | null>(null);
  return (
    <div className="flex w-72 flex-col gap-3">
      <MediaCapture
        mode="photo"
        facing="user"
        onCapture={(result) => setPhoto(result.url)}
        labels={{ prompt: "Take a profile picture with your camera.", start: "Turn on the camera" }}
      />
      {photo && <img src={photo} alt="Your new profile picture" className="h-20 w-20 rounded-full object-cover" />}
    </div>
  );
}
