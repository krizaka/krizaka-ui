// The colour roles a recipe may name, by the Tailwind utility suffix the preset gives them (`bg-accent`,
// `text-fg-secondary`, `border-border-default`) → the key of the same role in the native theme (`accent`, `textSecondary`,
// `borderDefault`). One table: the web class and the native colour cannot name different tokens. `recipes.test.ts`
// checks that every key of the right-hand side exists in the real native theme (@krizaka/tokens/native).
export const ROLES = {
  "surface-0": "surface0",
  "surface-1": "surface1",
  "surface-2": "surface2",
  "surface-3": "surface3",
  media: "media",
  scrim: "scrim",
  "scrim-strong": "scrimStrong",
  overlay: "overlay",
  "border-subtle": "borderSubtle",
  "border-default": "borderDefault",
  "border-strong": "borderStrong",
  fg: "textPrimary",
  "fg-secondary": "textSecondary",
  "fg-muted": "textMuted",
  "fg-on-media": "textOnMedia",
  "fg-accent": "accentText",
  "fg-success": "successText",
  "fg-warning": "warningText",
  "fg-danger": "dangerText",
  "fg-info": "infoText",
  accent: "accent",
  "accent-hover": "accentHover",
  "accent-soft": "accentSoft",
  "accent-2": "accent2",
  "on-accent": "onAccent",
  ring: "ring",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  "success-soft": "successSoft",
  "warning-soft": "warningSoft",
  "danger-soft": "dangerSoft",
  glass: "glassBg",
  "glass-border": "glassBorder",
} as const;

export type RoleName = keyof typeof ROLES;

/** Tailwind's type scale, in points (`text-xs` → 12). */
export const TEXT_SIZES = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30 } as const;

export const FONT_WEIGHTS = { normal: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800", black: "900" } as const;

/** `tracking-*`, in em (React Native takes points: the resolver multiplies by the font size). */
export const TRACKING = { tighter: -0.05, tight: -0.025, normal: 0, wide: 0.025, wider: 0.05, widest: 0.1 } as const;
