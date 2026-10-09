// Client: Radix tracks the image's loading state and shows the fallback until it has loaded (or when it fails).
import { Avatar as AvatarPrimitive } from "radix-ui";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const avatar = tv({
  slots: {
    root: "relative inline-flex shrink-0 overflow-hidden rounded-full bg-surface-3 align-middle",
    image: "h-full w-full object-cover",
    fallback: "flex h-full w-full items-center justify-center font-semibold uppercase text-fg-secondary",
    group: "flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-surface-0",
  },
  variants: {
    size: {
      xs: { root: "h-5 w-5 text-[9px]" },
      sm: { root: "h-8 w-8 text-xs" },
      md: { root: "h-10 w-10 text-sm" },
      lg: { root: "h-14 w-14 text-base" },
      xl: { root: "h-20 w-20 text-lg" },
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
};

export function AvatarRoot({ src, alt = "", fallback, size, className, ...props }: AvatarProps) {
  const s = avatar({ size });
  return (
    <AvatarPrimitive.Root data-size={size ?? "md"} className={s.root({ className })} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={alt} className={s.image()} />}
      <AvatarPrimitive.Fallback delayMs={src ? 300 : 0} className={s.fallback()}>
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
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
