import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";

// The crane listens: posed and unhurried — a calm opening, the words and one action beside it.
export default function MascotCrane() {
  return (
    <div className="flex w-96 items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <Mascot bird="crane" mood="welcome" size={88} />
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">Take your time</p>
        <p className="mt-1 text-sm text-fg-secondary">Say it in your own words. One question at a time.</p>
        <Button variant="primary" size="sm" className="mt-3">
          Begin
        </Button>
      </div>
    </div>
  );
}
