// Server-safe: no hook. An icon control of the top bar with an unread count — messages, notifications. A link (`href`, your
// router's `linkAs`) or a button (the trigger of the host's popover, through `asChild` of Radix: its props and ref are
// spread here). The count is drawn as a small badge and said in the name: « Notifications, 3 new ».
import * as React from "react";
import { tv } from "tailwind-variants";

import { countName, countText } from "./count-text";

export const appHeaderCount = tv({
  slots: {
    root:
      "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fg-secondary no-underline transition-colors " +
      "hover:bg-surface-2 hover:text-fg aria-expanded:bg-surface-2 aria-expanded:text-fg aria-[current=page]:bg-surface-2 aria-[current=page]:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
    icon: "inline-flex h-5 w-5 items-center justify-center [&>svg]:h-5 [&>svg]:w-5",
    count:
      "pointer-events-none absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 " +
      "font-mono text-[10px] font-bold leading-none tabular-nums text-on-accent ring-2 ring-surface-1",
  },
});
const s = appHeaderCount();

export type AppHeaderCountProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** What it is (« Notifications », « Messages ») — passed translated; its accessible name, with the count. */
  label: string;
  /** The icon (`<NotificationIcon />` of @krizaka/icons): decorative, the name is `label`. */
  icon: React.ReactNode;
  /** The unread count; 0 or absent draws no badge. */
  count?: number;
  /** The count in words, said after the label (« 3 new », « 3 nouvelles ») — passed translated, with its plural. Default: the number. */
  countLabel?: string;
  /**
   * Above it the badge shows `max+`.
   * @default 99
   */
  max?: number;
  /** A link to the page (`/notifications`) instead of a button. */
  href?: string;
  /** Your router's link (Next's `Link`) for `href`; an `<a>` otherwise. */
  linkAs?: React.ElementType;
  /** The page is the one it leads to (`aria-current="page"`). */
  current?: boolean;
};

/** An icon button or link of the top bar with an unread count, the count announced in its name. */
export function AppHeaderCount({ label, icon, count, countLabel, max = 99, href, linkAs, current, className, type, ...props }: AppHeaderCountProps) {
  const text = countText(count, max);
  const shared = {
    ...props,
    "aria-label": countName(label, count, countLabel),
    "aria-current": current ? ("page" as const) : undefined,
    "data-unread": text ? "" : undefined,
    className: s.root({ className }),
  };
  const children = (
    <>
      <span aria-hidden className={s.icon()}>{icon}</span>
      {text && <span aria-hidden data-count className={s.count()}>{text}</span>}
    </>
  );
  if (href) {
    const Link = linkAs ?? "a";
    return <Link href={href} {...shared}>{children}</Link>;
  }
  return <button type={type ?? "button"} {...shared}>{children}</button>;
}
