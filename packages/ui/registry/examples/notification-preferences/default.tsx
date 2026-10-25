"use client";
import { type NotificationMatrix,NotificationPreferences } from "@krizaka/ui/notification-preferences";
import * as React from "react";

const channels = [
  { id: "app", label: "In the app" },
  { id: "email", label: "By e-mail" },
] as const;
const categories = [
  { id: "social", label: "Followers and replies", description: "Someone follows you or answers." },
  { id: "messages", label: "Messages", description: "A new message in a conversation." },
  { id: "earnings", label: "Earnings", description: "A sale, a tip, a payout." },
  { id: "security", label: "Security", locked: true, lockedNote: "Always on: sign-ins and password changes." },
] as const;
const all = (on: boolean): NotificationMatrix => Object.fromEntries(categories.map((c) => [c.id, { app: on, email: on }]));
const presets = [
  { id: "everything", label: "Everything", hint: "Every category, in the app and by e-mail.", value: all(true) },
  { id: "essentials", label: "Essentials", hint: "In the app only, nothing by e-mail.", value: Object.fromEntries(categories.map((c) => [c.id, { app: true, email: false }])) },
  { id: "quiet", label: "Quiet", hint: "Nothing but security.", value: all(false) },
];

// TEMPLATE — the notifications part of an account page: presets first, then the matrix.
export default function NotificationPreferencesDefault() {
  const [value, setValue] = React.useState<NotificationMatrix>(presets[1]!.value);
  return (
    <NotificationPreferences label="Notification settings" presetsLabel="Presets" customHint="A mix of your own." channels={channels} categories={categories} presets={presets} value={value} onValueChange={setValue} className="max-w-2xl" />
  );
}
