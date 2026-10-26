import { Stamp } from "@krizaka/ui/specimen-tag";

// `ink` and `hue` tones, `size="sm"` (the frame stays askew, the text is straight) and a decorative glyph.
export default function SpecimenTagFacts() {
  return (
    <div className="flex flex-wrap items-center gap-6" data-hue="cobalt">
      <Stamp tone="ink" size="sm">45 min</Stamp>
      <Stamp tone="ink" size="sm">55 $</Stamp>
      <Stamp tone="hue" size="sm">Plateau</Stamp>
      <Stamp
        tone="hue"
        icon={<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c4-1 6-5 6-9 3 3 5 5 5 8s-3 3-5 3-4-1-6-2Z" /></svg>}
      >
        en ce moment : thé à la menthe
      </Stamp>
    </div>
  );
}
