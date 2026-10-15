import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";

// The beaver builds the shop: the day at work — the words and one action beside it.
export default function MascotBeaver() {
  return (
    <div className="flex w-96 items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <Mascot bird="beaver" mood="welcome" size={88} />
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">Six appointments today</p>
        <p className="mt-1 text-sm text-fg-secondary">The first one is at 9:30. Every invoice is ready.</p>
        <Button variant="primary" size="sm" className="mt-3">
          Open the day
        </Button>
      </div>
    </div>
  );
}
