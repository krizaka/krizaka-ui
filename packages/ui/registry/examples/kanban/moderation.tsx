"use client";

import { Badge } from "@krizaka/ui/badge";
import { Kanban, type KanbanMove } from "@krizaka/ui/kanban";
import { useState } from "react";

type Report = { id: string; video: string; reason: string; status: string };
const columns = [
  { id: "open", title: "To review", limit: 3 },
  { id: "reviewing", title: "Reviewing" },
  { id: "resolved", title: "Resolved" },
];

// The moderation queue: drag a report, or press Space and the arrow keys — every move announced.
export default function KanbanModeration() {
  const [reports, setReports] = useState<Report[]>([
    { id: "r1", video: "Backflip on the beach", reason: "Dangerous act", status: "open" },
    { id: "r2", video: "Cover of the summer hit", reason: "Copyright", status: "open" },
    { id: "r3", video: "Night drive", reason: "Copyright", status: "reviewing" },
    { id: "r4", video: "Q&A with fans", reason: "Spam", status: "resolved" },
  ]);
  const move = ({ cardId, to, index }: KanbanMove) =>
    setReports((all) => {
      const card = { ...all.find((r) => r.id === cardId)!, status: to };
      const rest = all.filter((r) => r.id !== cardId);
      const before = rest.filter((r) => r.status === to).slice(0, index);
      const at = before.length ? rest.indexOf(before[before.length - 1]!) + 1 : rest.findIndex((r) => r.status === to);
      return [...rest.slice(0, Math.max(0, at)), card, ...rest.slice(Math.max(0, at))];
    });
  const render = (r: Report) => (
    <div className="flex flex-col items-start gap-1.5">
      <span className="font-semibold">{r.video}</span>
      <Badge tone={r.reason === "Copyright" ? "warning" : "neutral"}>{r.reason}</Badge>
    </div>
  );
  return <Kanban aria-label="Moderation queue" columns={columns} cards={reports} getId={(r) => r.id} getColumn={(r) => r.status} getTitle={(r) => r.video} renderCard={render} onMove={move} />;
}
