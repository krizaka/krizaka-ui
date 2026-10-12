import { SplitView } from "@krizaka/ui/split-view";

// Nothing open yet: the detail pane says what to do (desktop); on a phone only the list shows.
export default function SplitViewEmpty() {
  return (
    <SplitView
      className="w-full"
      listTitle="Moderation"
      list={<p className="p-4 text-sm text-fg-secondary">5 comments waiting.</p>}
      empty="Choose a comment to review it."
    />
  );
}
