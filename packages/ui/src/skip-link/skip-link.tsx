// Client (it moves focus). WCAG 2.4.1 Bypass Blocks: the first tab stop of a page, a link that skips the navigation and
// lands on the content. Visually hidden until focused, then a pill above everything in the brand ring. The label is
// passed translated; the target needs an `id` (and is made focusable, so focus really moves, router or not).
import * as React from "react";
import { tv } from "tailwind-variants";

export const skipLink = tv({
  base:
    "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-surface-1 focus:px-4 focus:py-2 " +
    "focus:text-sm focus:font-semibold focus:text-fg focus:no-underline focus:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-ring",
});

export type SkipLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  /**
   * The content to land on: `#` and its `id`. The element becomes focusable (`tabindex="-1"`) when it is not.
   * @default "#content"
   */
  href?: `#${string}`;
};

/** A "skip to content" link: the first tab stop, hidden until focused; Enter moves focus to the target. */
export function SkipLink({ href = "#content", className, onClick, children, ...props }: SkipLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    if (!target.hasAttribute("tabindex") && !target.matches("a[href], button, input, select, textarea, [contenteditable]")) target.setAttribute("tabindex", "-1");
    target.focus();
  };
  return (
    <a href={href} className={skipLink({ className })} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
