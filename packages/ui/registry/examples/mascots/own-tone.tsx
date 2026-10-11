import { Mascot,MASCOT_BIRDS } from "@krizaka/ui/mascots";

// `tone="own"`: each bird in its colours of the Krizaka story (the story page, the about page) — not in a product.
export default function MascotOwnTone() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {MASCOT_BIRDS.map((bird) => (
        <Mascot key={bird} bird={bird} mood="welcome" tone="own" size={88} title={`The ${bird}`} />
      ))}
    </div>
  );
}
