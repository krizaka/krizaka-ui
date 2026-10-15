import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";

// The magpie keeps the score: a win counted, the standings moved — the words and one action beside it.
export default function MascotMagpie() {
  return (
    <div className="flex w-96 items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <Mascot bird="magpie" mood="success" size={88} />
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">+5 points — exact score</p>
        <p className="mt-1 text-sm text-fg-secondary">You move up to second place in the league.</p>
        <Button variant="primary" size="sm" className="mt-3">
          See the standings
        </Button>
      </div>
    </div>
  );
}
