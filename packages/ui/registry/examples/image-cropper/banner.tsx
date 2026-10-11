import { ImageCropper } from "@krizaka/ui/image-cropper";

// A profile's cover: a 3:1 frame, zoomed in on the centre.
export default function ImageCropperBanner() {
  return (
    <div className="w-full max-w-lg">
      <ImageCropper src="https://www.krizaka.com/assets/orochia/tour/alex-discover.jpg" aspect={3} defaultValue={{ x: 0.5, y: 0.45, zoom: 1.2 }} labels={{ frame: "Cover picture" }} />
    </div>
  );
}
