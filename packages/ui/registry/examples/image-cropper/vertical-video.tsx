"use client";

import { ImageCropper } from "@krizaka/ui/image-cropper";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

// A landscape video, a 9:16 frame: choose what the vertical version keeps. The size is the video's own.
export default function ImageCropperVerticalVideo() {
  return (
    <div className="w-48">
      <ImageCropper aspect={9 / 16} naturalSize={{ width: 1280, height: 800 }} defaultValue={{ x: 0.35, y: 0.5, zoom: 1 }} showZoom={false} labels={{ frame: "Vertical frame" }}>
        <video src={`${TOUR}/elena-earnings.mp4`} poster={`${TOUR}/elena-earnings.jpg`} muted playsInline preload="none" aria-hidden />
      </ImageCropper>
    </div>
  );
}
