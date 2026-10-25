// The links of the page blocks (PageHero's back link, LinkCard, ArgumentCard, ActionBar): an internal path renders
// through the app's router link (`linkAs`, e.g. Next's `Link`), anything else is an `<a>` that opens in a new tab.
// Shared by the block entries; never exported on its own.
import type * as React from "react";

/** The app's link component (Next's `Link`, React Router's `Link`…): receives `href`, `className` and the children. */
export type LinkComponent = React.ElementType<{ href: string; className?: string; children?: React.ReactNode; "aria-label"?: string; "aria-describedby"?: string }>;

/** An address that leaves the app: an absolute URL or a protocol (`mailto:`). */
export const isExternal = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);

export function BlockLink({
  href,
  linkAs: Link = "a",
  external = isExternal(href),
  rel,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & { href: string; linkAs?: LinkComponent; external?: boolean }) {
  if (external) return <a href={href} target="_blank" rel={rel ?? "noopener noreferrer"} {...props} />;
  const Comp = Link as React.ElementType;
  return <Comp href={href} rel={rel} {...props} />;
}
