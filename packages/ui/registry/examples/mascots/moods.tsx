import { Mascot,MASCOT_MOODS } from "@krizaka/ui/mascots";

// One bird, its five moods: a welcome, a long wait, a success, an empty list, an error.
export default function MascotMoods() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {MASCOT_MOODS.map((mood) => (
        <figure key={mood} className="flex flex-col items-center gap-2">
          <Mascot bird="owl" mood={mood} size={88} />
          <figcaption className="text-xs text-fg-secondary">{mood}</figcaption>
        </figure>
      ))}
    </div>
  );
}
