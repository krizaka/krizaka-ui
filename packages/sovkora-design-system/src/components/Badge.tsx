import { Badge as KzBadge, type BadgeProps as KzBadgeProps } from "@krizaka/ui/badge";

export { type BadgeVariants, badgeVariants } from "@krizaka/ui/badge";

/** The 1.x badge variants. @deprecated Since 2.0 — use `tone`. */
export type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent";

/** Props of {@link Badge}: the @krizaka/ui badge, plus the 1.x `variant`. */
export type BadgeProps = KzBadgeProps & {
  /** @deprecated Since 2.0 — use `tone` (`default` → `neutral`, the other names are the same). */
  variant?: BadgeVariant;
};

const TONE_OF_VARIANT = {
  default: "neutral",
  success: "success",
  warning: "warning",
  danger: "danger",
  accent: "accent",
} as const satisfies Record<BadgeVariant, NonNullable<KzBadgeProps["tone"]>>;

/**
 * The @krizaka/ui badge (`tone` neutral · accent · success · warning · danger · scrim, `size`, `dot`, `pulse`), with
 * the 1.x `variant` kept as a deprecated alias of `tone`. `tone` wins when both are given.
 *
 * @param props - {@link BadgeProps}
 * @returns A status badge.
 */
export function Badge({ variant, tone, ...props }: BadgeProps) {
  return <KzBadge tone={tone ?? (variant ? TONE_OF_VARIANT[variant] : undefined)} {...props} />;
}
