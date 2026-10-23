import { Polaroid } from "@krizaka/ui/wall";

export default function PolaroidExample() {
  const photo = <svg role="img" aria-label="Mountain silhouette" viewBox="0 0 200 200"><rect width="200" height="200" fill="var(--kz-accent-soft)" /><path d="m0 200 80-170 55 100 30-45 35 115Z" fill="var(--kz-accent)" /></svg>;
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <Polaroid img={photo} caption="A day outside" rotation={-3} attachment="tape" attachmentRotation={7} />
    <Polaroid img={photo} caption="Pinned for later" rotation={3} attachment="pin" />
  </div>;
}
