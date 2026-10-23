import { Polaroid } from "@krizaka/ui/wall";

export default function PolaroidExample() {
  const m = { mountainAlt: "Mountain silhouette", outsideCaption: "A day outside", pinnedCaption: "Pinned for later" };
  const photo = <svg role="img" aria-label={m.mountainAlt} viewBox="0 0 200 200"><rect width="200" height="200" fill="var(--kz-accent-soft)" /><path d="m0 200 80-170 55 100 30-45 35 115Z" fill="var(--kz-accent)" /></svg>;
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <Polaroid img={photo} caption={m.outsideCaption} rotation={-3} attachment="tape" attachmentRotation={7} />
    <Polaroid img={photo} caption={m.pinnedCaption} rotation={3} attachment="pin" />
  </div>;
}
