import { ActivityFeed } from "@krizaka/ui/activity-feed";

const now = new Date("2026-10-11T15:00:00Z");
const events = [
  { id: "e1", at: "2026-10-11T14:58:00Z", title: "Dubbing of “Sunset session” finished", tone: "success" as const, kind: "job.done", actor: "studio" },
  { id: "e2", at: "2026-10-11T14:31:00Z", title: "Elena started a dubbing job", description: "English, Spanish · 120 credits", tone: "accent" as const },
  { id: "e3", at: "2026-10-11T13:05:00Z", title: "Mina tipped your video $5", kind: "tip", actor: "mina", tone: "success" as const },
  { id: "e4", at: "2026-10-11T12:50:00Z", title: "Mina tipped your video $5", kind: "tip", actor: "mina", tone: "success" as const },
  { id: "e5", at: "2026-10-11T12:41:00Z", title: "Mina tipped your video $5", kind: "tip", actor: "mina", tone: "success" as const },
  { id: "e6", at: "2026-10-10T18:20:00Z", title: "Clip job failed: the source is too short", tone: "danger" as const },
  { id: "e7", at: "2026-10-09T09:00:00Z", title: "Your payout of $120 was sent", tone: "info" as const },
];

// Grouped by day, a run of tips folded into one (×3), how long ago — Orazaka's and Orochia's activity.
export default function ActivityFeedJobActivity() {
  return <ActivityFeed aria-label="Activity" events={events} now={now} ticking={false} className="max-w-md" />;
}
