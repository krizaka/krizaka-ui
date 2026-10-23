import { Wall } from "@krizaka/ui/wall";

export default function FrenchCompositionExample() {
  const m = {
    wallLabel: "Dans notre atelier", photoAlt: "La montagne au-dessus de notre atelier",
    caption: "La vue d’ici", note: "Fait avec patience. Partagé avec plaisir.",
    signature: "Sam", sign: "Atelier du coin",
  };
  return <div lang="fr"><Wall aria-label={m.wallLabel} texture="brick" height={520} itemWidth={220} items={[
    { kind: "polaroid", id: "photo", z: 1, x: 8, y: 18, rotation: -4, attachment: "tape", attachmentRotation: 6, caption: m.caption,
      img: <svg viewBox="0 0 240 240" role="img" aria-label={m.photoAlt}>
        <rect width="240" height="240" fill="var(--kz-accent-soft)" />
        <path d="m0 240 100-190 55 110 35-45 50 125Z" fill="var(--kz-accent)" />
      </svg> },
    { kind: "note", id: "word", z: 2, x: 52, y: 75, rotation: 3, attachment: "pin", text: m.note, signature: m.signature },
    { kind: "sign", id: "sign", z: 3, x: 94, y: 22, rotation: -2, variant: "enamel", logo: m.sign },
  ]} /></div>;
}
