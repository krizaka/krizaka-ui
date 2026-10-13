"use client";

import { ActivityFeed } from "@krizaka/ui/activity-feed";
import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { useState } from "react";

const NAMES = ["Mina", "Alex", "Elena", "Noah"];

// Live: new bids arrive, the feed announces them politely; each event led by its actor's avatar.
export default function ActivityFeedLive() {
  const [events, setEvents] = useState([{ id: "b0", at: "2026-10-11T18:02:00Z", title: "Alex bid $25", actor: "Alex", kind: "bid" }]);
  const bid = () =>
    setEvents((all) => {
      const who = NAMES[all.length % NAMES.length]!;
      return [...all, { id: `b${all.length}`, at: new Date(Date.parse("2026-10-11T18:02:00Z") + all.length * 60_000).toISOString(), title: `${who} bid $${25 + all.length * 5}`, actor: who, kind: "bid" }];
    });
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Button size="sm" onClick={bid}>Simulate a bid</Button>
      <ActivityFeed aria-label="Bids" events={events} live fold={false} now={new Date("2026-10-11T18:30:00Z")} ticking={false} leading={(e) => <Avatar alt={e.actor ?? ""} fallback={(e.actor ?? "?").charAt(0)} size="sm" />} />
    </div>
  );
}
