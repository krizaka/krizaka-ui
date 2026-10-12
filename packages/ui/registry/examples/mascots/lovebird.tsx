import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";

// The lovebird introduces: two people who chose each other meet — the words and the next step beside it.
export default function MascotLovebird() {
  return (
    <div className="flex w-96 items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <Mascot bird="lovebird" mood="success" size={88} />
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">You are both interested</p>
        <p className="mt-1 text-sm text-fg-secondary">Your introduction is open for seven days.</p>
        <Button variant="primary" size="sm" className="mt-3">
          Say hello
        </Button>
      </div>
    </div>
  );
}
