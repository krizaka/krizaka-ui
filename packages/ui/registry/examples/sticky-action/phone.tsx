import { Button } from "@krizaka/ui/button";
import { StickyAction } from "@krizaka/ui/sticky-action";

// The last child of the page's main: on a phone it holds the bottom edge; from md up it is not drawn.
export default function StickyActionPhone() {
  return (
    <main className="flex h-[28rem] flex-col overflow-auto">
      <p className="m-0 h-[40rem] p-4 text-fg-secondary">The page scrolls here…</p>
      <StickyAction>
        <Button size="lg" variant="primary">Book</Button>
      </StickyAction>
    </main>
  );
}
