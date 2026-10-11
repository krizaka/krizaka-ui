"use client";

import { type CropValue, ImageCropper } from "@krizaka/ui/image-cropper";
import * as React from "react";

// A round mask on a square frame: what others will see. Send the focus point and the zoom with the file.
export default function ImageCropperAvatar() {
  const [crop, setCrop] = React.useState<CropValue>({ x: 0.42, y: 0.5, zoom: 1.4 });
  return (
    <div className="w-64">
      <ImageCropper src="https://www.krizaka.com/assets/orochia/tour/elena-live.jpg" aspect={1} round value={crop} onValueChange={setCrop} />
    </div>
  );
}
