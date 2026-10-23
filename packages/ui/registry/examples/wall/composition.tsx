import { Wall, type WallItem } from "@krizaka/ui/wall";

const items: WallItem[] = [
  { id: "photo", kind: "polaroid", x: 8, y: 18, rotation: -4, z: 1,
    img: <svg role="img" aria-label="The mountain above our workshop" viewBox="0 0 240 240"><rect width="240" height="240" fill="var(--kz-accent-soft)" /><path d="m0 240 100-190 55 110 35-45 50 125Z" fill="var(--kz-accent)" /></svg>,
    caption: "The view from here", attachment: "tape", attachmentRotation: 6 },
  { id: "word", kind: "note", x: 52, y: 75, rotation: 3, z: 2, text: "Made slowly. Shared gladly.", signature: "Sam", attachment: "pin" },
  { id: "sign", kind: "sign", x: 94, y: 22, rotation: -2, z: 3, logo: "Atelier du coin", variant: "enamel" },
];

export default function CompositionExample() {
  return <Wall aria-label="From our workshop" texture="brick" items={items} height={520} itemWidth={220} />;
}
