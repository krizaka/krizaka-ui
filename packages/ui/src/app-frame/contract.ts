// Server-safe, pure. The rules of the signed-in frame, written once and tested (the audit's F1 and F2): what the account
// menu holds and in which order, where a place lives (the rail or the avatar, never both), what a phone's tab bar can carry.
import type * as React from "react";

/** The places the account menu can hold, in the order the frame draws them. */
export const ACCOUNT_LINK_IDS = ["profile", "settings", "billing", "administration"] as const;
export type AccountLinkId = (typeof ACCOUNT_LINK_IDS)[number];

/** The account menu from top to bottom: who you are, the places, the preferences, Sign out. Fixed by the frame, not by the product. */
export const ACCOUNT_MENU_ORDER = ["identity", "profile", "settings", "billing", "administration", "language", "theme", "signOut"] as const;

/** The most destinations a phone's tab bar carries (the rail's main items; the foot follows them in the same bar). */
export const MAIN_SECTIONS_MAX = 5;

export interface FrameSection {
  /** Stable id; `settings`, `billing`, `profile`, `administration` are the account menu's places. */
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Not offered to this person (a permission, a feature not open): left out of the rail and the tab bar. */
  gated?: boolean;
  /** A count on the icon. */
  badge?: string | number;
  /** The count in words (« 3 to decide »). */
  badgeLabel?: string;
  /** `main`: what the person works in (the tab bar on a phone). `foot`: the rail's foot. @default "main" */
  place?: "main" | "foot";
}

export interface FramePlaces {
  main: FrameSection[];
  foot: FrameSection[];
  /** Sections left out of the rail because the account menu already holds that place (or because they are gated). */
  dropped: { id: string; reason: "account" | "gated" }[];
}

/**
 * Splits the sections into the rail's main and foot, in the order given. A place is on the rail or under the avatar,
 * never both: a section whose id is one of the account links the frame was given leaves the rail (the avatar owns it).
 * A gated section leaves too.
 */
export function framePlaces(sections: readonly FrameSection[], accountLinks: readonly string[] = []): FramePlaces {
  const result: FramePlaces = { main: [], foot: [], dropped: [] };
  for (const section of sections) {
    if (section.gated) result.dropped.push({ id: section.id, reason: "gated" });
    else if (accountLinks.includes(section.id)) result.dropped.push({ id: section.id, reason: "account" });
    else result[section.place === "foot" ? "foot" : "main"].push(section);
  }
  return result;
}

/** The account links the frame draws, in the frame's order, whatever the order they were written in. Only what was passed. */
export function orderAccountLinks<T>(links: Partial<Record<AccountLinkId, T>> | undefined, admin = false): { id: AccountLinkId; link: T }[] {
  if (!links) return [];
  return ACCOUNT_LINK_IDS.flatMap((id) => {
    const link = links[id];
    // Inside the administration, the way into it is not offered again.
    return link && !(admin && id === "administration") ? [{ id, link }] : [];
  });
}

/** What is wrong with a frame's data, in words for the developer (empty: it is right). Used by the tests and by the dev warning. */
export function frameIssues(sections: readonly FrameSection[], accountLinks: readonly string[] = []): string[] {
  const issues: string[] = [];
  const ids = sections.map((s) => s.id);
  for (const id of new Set(ids)) if (ids.filter((x) => x === id).length > 1) issues.push(`The section "${id}" is declared twice.`);
  const places = framePlaces(sections, accountLinks);
  for (const { id, reason } of places.dropped) if (reason === "account") issues.push(`"${id}" is on the rail and under the avatar: a place is in one of them, so the rail drops it.`);
  if (places.main.length > MAIN_SECTIONS_MAX) issues.push(`${places.main.length} main sections: a phone's tab bar carries ${MAIN_SECTIONS_MAX} at most.`);
  return issues;
}
