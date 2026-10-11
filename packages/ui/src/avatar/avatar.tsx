// Client: Radix tracks the image's loading state and shows the fallback until it has loaded (or when it fails).
import { Avatar as AvatarPrimitive } from "radix-ui";
import * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";

const avatar = tv({
  slots: {
    root: "relative inline-flex shrink-0 overflow-hidden rounded-full bg-surface-3 bg-sheen align-middle inset-shadow-edge",
    image: "h-full w-full object-cover",
    fallback: "flex h-full w-full items-center justify-center font-semibold uppercase text-fg-secondary",
    group: "flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-surface-0",
    // With a status or a ring, the avatar sits in a frame the dot can overflow.
    frame: "relative inline-flex shrink-0 rounded-full align-middle",
    // The presence ring: the brand's gradient around the avatar, a gap of the surface between them.
    ringed: "bg-linear-to-br from-accent to-accent-2 p-[2px] shadow-glow [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-(--kz-avatar-surface,var(--kz-surface-0))",
    // The status: a dot in the bottom-right corner, cut out of the avatar by a ring of the surface colour.
    status:
      "absolute bottom-0 right-0 rounded-full ring-2 ring-(--kz-avatar-surface,var(--kz-surface-0)) " +
      "data-[status=online]:bg-success data-[status=online]:shadow-[0_0_6px_var(--kz-success)] " +
      "data-[status=away]:border-2 data-[status=away]:border-warning data-[status=away]:bg-(--kz-avatar-surface,var(--kz-surface-0))",
  },
  variants: {
    size: {
      xs: { root: "h-5 w-5 text-[9px]", status: "size-1.5" },
      sm: { root: "h-8 w-8 text-xs", status: "size-2.5" },
      md: { root: "h-10 w-10 text-sm", status: "size-3" },
      lg: { root: "h-14 w-14 text-base", status: "size-3.5 bottom-0.5 right-0.5" },
      xl: { root: "h-20 w-20 text-lg", status: "size-4 bottom-1 right-1" },
    },
  },
  defaultVariants: { size: "md" },
});

export type AvatarSize = NonNullable<VariantProps<typeof avatar>["size"]>;

export type AvatarProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The image's URL; `null` or nothing shows the `fallback`. */
  src?: string | null;
  /** The image's text alternative (the person's name); empty when a visible name sits next to the avatar. */
  alt?: string;
  /** Shown while the image loads, when it fails or when there is none: initials, an icon. */
  fallback?: React.ReactNode;
  /**
   * xs · sm · md · lg · xl.
   * @default "md"
   */
  size?: AvatarSize;
  /**
   * The person's presence: `online` (a green dot), `away` (an amber ring) in the bottom-right corner — decorative: say
   * the status in words next to it or in the accessible name. The dot is cut out by a ring of the surface colour
   * (`--kz-avatar-surface`, default `--kz-surface-0`: set it to the surface the avatar sits on).
   */
  status?: "online" | "away" | null;
  /** The presence ring: the brand's gradient around the avatar (someone live, a new story) — decorative too. */
  ring?: boolean;
};

export function AvatarRoot({ src, alt = "", fallback, size, status, ring, className, ...props }: AvatarProps) {
  const s = avatar({ size });
  const avatarEl = (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size ?? "md"}
      className={s.root({ className: status || ring ? undefined : className })}
      {...(status || ring ? {} : props)}
    >
      {src && <AvatarPrimitive.Image src={src} alt={alt} className={s.image()} />}
      <AvatarPrimitive.Fallback delayMs={src ? 300 : 0} className={s.fallback()}>
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
  if (!status && !ring) return avatarEl;
  return (
    <span data-status={status ?? undefined} data-ring={ring ? "" : undefined} className={s.frame({ className: [ring && s.ringed(), className].filter(Boolean).join(" ") })} {...props}>
      {avatarEl}
      {status && <span aria-hidden data-status={status} className={s.status()} />}
    </span>
  );
}

export type AvatarGroupProps = React.ComponentProps<"div"> & {
  /** How many avatars are shown; the rest becomes a `+n` avatar. */
  max?: number;
  /** The size of the `+n` avatar (match the avatars of the group). */
  size?: AvatarSize;
};

/** Overlapping avatars; past `max`, a `+n` avatar counts the rest. */
export function AvatarGroup({ max, size, className, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const shown = max === undefined ? items : items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <div className={avatar().group({ className })} {...props}>
      {shown}
      {rest > 0 && <AvatarRoot size={size} fallback={`+${rest}`} />}
    </div>
  );
}

/** `Avatar` (an image with a fallback) and `Avatar.Group`. */
export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });
