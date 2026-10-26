import { Button } from "@krizaka/ui/button";
import { StickyAction } from "@krizaka/ui/sticky-action";

// `hideWhileVisible`: while the page's own « Book » is on screen the bar is hidden, so a phone never shows two at once.
export default function StickyActionHideWhileVisible() {
  return (
    <main className="flex h-[28rem] flex-col overflow-auto">
      <div className="p-4">
        <Button id="hero-book" size="lg" variant="primary">Book</Button>
      </div>
      <p className="m-0 h-[40rem] p-4 text-fg-secondary">The page scrolls here…</p>
      <StickyAction hideWhileVisible="#hero-book">
        <Button size="lg" variant="primary">Book</Button>
      </StickyAction>
    </main>
  );
}
