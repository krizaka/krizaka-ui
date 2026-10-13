import { Timeline } from "@krizaka/ui/activity-feed";

// One thing's history, oldest first: a payout from request to bank.
export default function ActivityFeedTimeline() {
  return (
    <Timeline
      aria-label="History of the payout"
      locale="en-GB"
      timeStyle="datetime"
      className="max-w-md"
      events={[
        { id: "t1", at: "2026-10-09T09:00:00Z", title: "Payout requested", description: "$120.00 to the account ending 4821" },
        { id: "t2", at: "2026-10-09T09:01:00Z", title: "Funds reserved", tone: "accent" },
        { id: "t3", at: "2026-10-10T07:30:00Z", title: "Sent to Stripe", tone: "info" },
        { id: "t4", at: "2026-10-11T10:12:00Z", title: "Arrived at the bank", tone: "success" },
      ]}
    />
  );
}
