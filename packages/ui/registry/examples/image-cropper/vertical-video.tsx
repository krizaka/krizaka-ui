"use client";

import { ImageCropper } from "@krizaka/ui/image-cropper";

// A landscape video, a 9:16 frame: choose what the vertical version keeps. The size is the video's own.
export default function ImageCropperVerticalVideo() {
  return (
    <div className="w-48">
      <ImageCropper aspect={9 / 16} naturalSize={{ width: 1280, height: 800 }} defaultValue={{ x: 0.35, y: 0.5, zoom: 1 }} showZoom={false} labels={{ frame: "Vertical frame" }}>
        <video src="https://krizaka-assets.b-cdn.net/site/home/kit/challenge-v.22cb2a30f8.mp4" poster="https://krizaka-assets.b-cdn.net/site/home/kit/challenge-v.7f6f208377.jpg" muted playsInline preload="none" aria-hidden />
      </ImageCropper>
    </div>
  );
}
