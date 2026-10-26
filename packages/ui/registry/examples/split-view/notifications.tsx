import { ActivityFeed } from "@krizaka/ui/activity-feed";
import { Button } from "@krizaka/ui/button";
import { SplitView } from "@krizaka/ui/split-view";

const NOW = new Date("2026-10-13T10:00:00Z");
const EVENTS = [
  { id: "n1", at: "2026-10-13T09:40:00Z", title: "Mina unlocked “Night shoot, part 2”", tone: "success" as const },
  { id: "n2", at: "2026-10-13T08:15:00Z", title: "Your payout of €120 was sent", tone: "info" as const },
  { id: "n3", at: "2026-10-12T19:02:00Z", title: "Léa bid €25 on the auction", tone: "accent" as const },
];

// TEMPLATE — a notifications centre: what happened, newest first, grouped by day; the selected one opens beside the list
// (a screen of its own on a phone). Marking all as read is one button, never a hidden gesture.
export default function SplitViewNotifications() {
  return (
    <SplitView
      className="brand-orazaka w-full"
      listTitle="Notifications"
      showDetail={false}
      back={<a href="#notifications" className="text-sm font-medium text-fg-secondary">← Notifications</a>}
      list={
        <div className="flex flex-col gap-3 p-3">
          <Button size="sm" variant="ghost" className="w-fit">Mark all as read</Button>
          <ActivityFeed aria-label="Notifications" events={EVENTS} now={NOW} ticking={false} />
        </div>
      }
      detailHead={<span className="text-sm font-bold text-fg">Mina unlocked “Night shoot, part 2”</span>}
      detail={<p className="text-sm text-fg-secondary">€4.99 unlocked at 09:40. Your share, €4.49, is paid out on Monday.</p>}
    />
  );
}
