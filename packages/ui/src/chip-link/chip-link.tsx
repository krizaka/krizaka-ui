// Server-safe: no hook, no context. A chip that is a link — a filter that is an address (`/explore?tag=night`): the look
// of `Chip`, the current filter marked by `selected` (`aria-current`, the accent), usable in a Server Component.
// `chipVariants` styles anything else (a router link you render yourself).
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const chipVariants = tv({
  base:
    "inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-semibold no-underline transition-colors " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  variants: {
    size: { sm: "h-7 px-3 text-xs", md: "h-9 px-3.5 text-xs" },
    selected: {
      false: "border-border-default bg-surface-1 text-fg-secondary hover:border-border-strong hover:text-fg",
      true: "border-accent bg-accent-soft text-fg",
    },
  },
  defaultVariants: { size: "md", selected: false },
});

export type ChipVariantsProps = VariantProps<typeof chipVariants>;

export type ChipLinkProps = React.ComponentProps<"a"> & {
  /**
   * sm · md.
   * @default "md"
   */
  size?: ChipVariantsProps["size"];
  /** The current filter: the accent, `aria-current` (`page` by default) and `data-state="on"`. */
  selected?: boolean;
  /**
   * What `aria-current` says when selected: `page` (a filter that is a page) or `true`.
   * @default "page"
   */
  current?: "page" | "true";
  /** Renders your router's `<Link>` with the chip's look. */
  asChild?: boolean;
};

/** A filter that is a link, with the look of `Chip`. */
export function ChipLink({ size, selected = false, current = "page", asChild, className, ...props }: ChipLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-state={selected ? "on" : "off"}
      aria-current={selected ? current : undefined}
      className={chipVariants({ size, selected, className })}
      {...props}
    />
  );
}
