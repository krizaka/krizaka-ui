import { TapedPhoto } from "@krizaka/ui/taped-photo";

// One strip at the top, leaning right: a shop's photo on its wall, its caption written on the print.
export default function TapedPhotoTop() {
  return (
    <TapedPhoto className="max-w-sm" tape="top" tilt={2.2} caption="Le comptoir, rue Saint-Denis">
      <div style={{ aspectRatio: "4 / 3", background: "var(--kz-surface-sunken)" }} role="img" aria-label="The counter of the shop" />
    </TapedPhoto>
  );
}
