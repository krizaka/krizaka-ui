import { Button } from "@krizaka/ui/button";
import { EmptyState } from "@krizaka/ui/empty-state";
import { Mascot } from "@krizaka/ui/mascots";
import { Page } from "@krizaka/ui/page";

// TEMPLATE — a page with nothing in it yet (a creator's library): the page keeps its title and place, the bird says it is
// empty, one sentence tells what will fill it, one button does the first thing. Never a blank screen.
export default function EmptyStateLibrary() {
  return (
    <Page className="brand-orochia">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-fg">Library</h1>
      <EmptyState
        icon={<Mascot bird="flamingo" mood="empty" size={96} />}
        title="Nothing here yet"
        description="Your videos, once published, wait here with their sales. The first one takes about ten minutes."
        action={<Button variant="primary" shape="cut">Publish a first video</Button>}
      />
    </Page>
  );
}
