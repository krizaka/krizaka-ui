"use client";
import { Agenda } from "@krizaka/ui/agenda";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import * as React from "react";

const at = (id: string, hour: number, title: string, description: string, status: string) => ({
  id, title, description, status, done: status === "Done",
  start: `2026-10-22T${String(hour).padStart(2, "0")}:00:00Z`,
  end: `2026-10-22T${String(hour).padStart(2, "0")}:45:00Z`,
});
const items = [
  at("a1", 9, "Léa Tremblay", "Cut and colour · Camille", "Done"),
  at("a2", 10, "Marc Gagnon", "Beard trim · Camille", "Done"),
  at("a3", 11, "Sofia Rossi", "Cut · Éric", "Booked"),
  at("a4", 13, "Nadia Ben Ali", "Colour · Camille", "Booked"),
];

// The day, the past dimmed, « now » between the done and the booked; one quiet action on the rows to come.
export default function AgendaDay() {
  const [open, setOpen] = React.useState<string | null>("a3");
  return (
    <Agenda
      aria-label="Appointments of Thursday"
      timeZone="UTC"
      now={new Date("2026-10-22T10:50:00Z")}
      selectedId={open}
      onSelect={(item) => setOpen(item.id)}
      items={items.map((i) => ({ ...i, tone: i.done ? ("success" as const) : ("accent" as const), leading: <Avatar alt="" fallback={i.title.charAt(0)} size="sm" />, status: <Badge tone={i.done ? "success" : "accent"}>{i.status}</Badge> }))}
      action={(i) => (i.done ? null : <Button size="sm" variant="ghost">Start</Button>)}
      className="max-w-xl"
    />
  );
}
