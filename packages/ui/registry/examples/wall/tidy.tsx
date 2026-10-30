import { Wall, type WallItem } from "@krizaka/ui/wall";

const m = {
  wallLabel: "From the shop",
  photo: (alt: string, hue: string) => <svg role="img" aria-label={alt} viewBox="0 0 240 240"><rect width="240" height="240" fill={hue} /><path d="m0 240 100-190 55 110 35-45 50 125Z" fill="var(--kz-accent)" opacity=".8" /></svg>,
};
const items: WallItem[] = [
  { id: "front", kind: "polaroid", z: 1, img: m.photo("The shop front", "var(--kz-accent-soft)"), caption: "Rue Saint-Denis, since 2019" },
  { id: "note", kind: "note", z: 2, text: "Open late on Fridays. Walk-ins welcome.", signature: "Rose", attachment: "pin" },
  { id: "chair", kind: "polaroid", z: 3, img: m.photo("The first chair", "var(--kz-surface-3)"), caption: "The first chair", attachment: "pin" },
  { id: "window", kind: "polaroid", z: 4, img: m.photo("The window", "var(--kz-surface-2)"), caption: "The window in May" },
  { id: "sign", kind: "sign", z: 5, logo: "Atelier Rose", variant: "enamel" },
  { id: "wash", kind: "polaroid", z: 6, img: m.photo("The wash basin", "var(--kz-accent-soft)"), caption: "The wash basin" },
  { id: "note2", kind: "note", z: 7, text: "Bring a photo of the cut you like.", signature: "Rose" },
];

export default function WallTidy() {
  return <Wall aria-label={m.wallLabel} layout="tidy" texture="plaster" items={items} />;
}
