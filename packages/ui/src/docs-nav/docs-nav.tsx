// Server-safe. The pages of a documentation, grouped: a quiet list of links, each group a native `details` (open when it
// holds the current page), only the current page marked. No state: the app tells which page is current.
import * as React from "react";

import { cn } from "../cn";
import type { LinkComponent } from "../page-hero";

export type DocsNavGroup = {
  /** A stable key. */
  id: string;
  /** The group's name — one word or two. */
  title: React.ReactNode;
  /** Its pages: a short, one-line title each. */
  items: readonly { href: string; label: React.ReactNode }[];
};

export type DocsNavProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The navigation's accessible name (`Documentation`). */
  label: string;
  /** The groups, in order. */
  groups: readonly DocsNavGroup[];
  /** The `href` of the page being read. */
  current?: string;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** The pages of the documentation in groups; the group of the current page is open, the others fold. */
export function DocsNav({ label, groups, current, linkAs, className, ...props }: DocsNavProps) {
  const L = linkAs ?? "a";
  return (
    <nav aria-label={label} className={cn("flex flex-col gap-1 text-sm", className)} {...props}>
      {groups.map((g) => {
        const open = g.items.some((i) => i.href === current) || !current;
        return (
          <details key={g.id} open={open} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold text-fg-muted marker:content-none hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {g.title}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-3.5 w-3.5 fill-none stroke-current stroke-2 transition-transform group-open:rotate-180 motion-reduce:transition-none">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ul className="mt-1 flex flex-col gap-0.5 border-l border-border-subtle">
              {g.items.map((i) => (
                <li key={i.href}>
                  <L
                    href={i.href}
                    aria-current={i.href === current ? "page" : undefined}
                    className="-ml-px block truncate border-l border-transparent px-3 py-1.5 text-fg-secondary no-underline transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:border-accent aria-[current=page]:font-semibold aria-[current=page]:text-fg"
                  >
                    {i.label}
                  </L>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </nav>
  );
}
