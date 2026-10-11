import { LinkCard } from "@krizaka/ui/link-card";
import { PointerLight } from "@krizaka/ui/pointer-light";

// Any group of cards that is not a CardGrid (a flex row, a list): drop `PointerLight` inside it — it listens on its
// parent and lights the card the pointer is over (`[data-kz-light]`). Nothing on touch screens or under reduced motion.
export default function PointerLightList() {
  return (
    <div className="flex w-full max-w-3xl flex-wrap gap-3">
      <LinkCard className="flex-1 basis-56" href="#tokens" title="Tokens" description="Every colour, radius and shadow." />
      <LinkCard className="flex-1 basis-56" href="#preset" title="Tailwind preset" description="The tokens as utilities." />
      <PointerLight />
    </div>
  );
}
