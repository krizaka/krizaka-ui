// Pure, no import: shared by the web's AppHeaderCount and the native one (src/native/app-header.tsx).

/** What the badge shows: the count, or `max+` above `max`; nothing at 0. */
export function countText(count: number | undefined, max = 99): string | null {
  if (!count || count <= 0 || !Number.isFinite(count)) return null;
  return count > max ? `${max}+` : String(Math.floor(count));
}

/** The control's accessible name: the label alone, or the label and the count's words (« Notifications, 3 new »). */
export function countName(label: string, count: number | undefined, countLabel?: string): string {
  if (!countText(count, Number.POSITIVE_INFINITY)) return label;
  return `${label}, ${countLabel ?? String(Math.floor(count!))}`;
}
