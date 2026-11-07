/**
 * @file index.ts
 * @description Public surface of `@krizaka/sovkora-design-system` — the Sovkora identity on the Krizaka platform:
 * the theme (`./theme.css`, --kz-* overrides; import it once at the app root, after `tailwindcss`), the product
 * composites, and a few @krizaka/ui primitives re-exported with their Sovkora defaults (Button's `primary`). Every
 * other primitive — Card, Dialog, Toaster, Loader, Stepper, Meter, NumberTicker… — is imported from @krizaka/ui.
 */

// ── Design tokens (framework-agnostic, from sovkora-shared) ─────────────────
// The token values for React Native and the CLI (the Sovkora orange of @krizaka/tokens/native). The web theme is
// theme.css (--kz-* roles).
export type { ThemeColors, ThemeName, Tokens } from "@krizaka/sovkora-shared";
export { radius, shadows, status, themes, tokens, typeScale } from "@krizaka/sovkora-shared";

// ── Class helpers ───────────────────────────────────────────────────────────
export { cn } from "@krizaka/ui/cn";

// ── Icon registry ───────────────────────────────────────────────────────────
export type { IconName } from "./icon";
export { Icon } from "./icon";

// ── Primitives from @krizaka/ui (re-exported) ───────────────────────────────
export type { BadgeProps, BadgeVariant, BadgeVariants } from "./components/Badge";
export { Badge, badgeVariants } from "./components/Badge";
export type { ButtonProps, ButtonVariants, IconButtonProps } from "./components/Button";
export { Button, buttonVariants, IconButton } from "./components/Button";
export type { InputProps } from "./components/Input";
export { Field, Input, Select, Textarea } from "./components/Input";
export type { SkeletonGroupProps, SkeletonProps } from "./components/Skeleton";
export { Skeleton, SkeletonGroup, skeletonVariants } from "./components/Skeleton";

// ── Sovkora composites ──────────────────────────────────────────────────────
export type { ChatShowcaseLabels, ChatShowcaseProps } from "./components/ChatShowcase";
export { ChatShowcase } from "./components/ChatShowcase";
export type { ClipPlayerLabels, ClipPlayerProps, ClipSources } from "./components/ClipPlayer";
export { ClipPlayer } from "./components/ClipPlayer";
export type { CommandPaletteItem, CommandPaletteLabels, CommandPaletteProps } from "./components/CommandPalette";
export { CommandPalette } from "./components/CommandPalette";
export type { RunFact, RunFactsProps } from "./components/RunFacts";
export { RunFacts } from "./components/RunFacts";
export { SentinelMini } from "./components/SentinelMini";
export type { VideoResultFact, VideoResultLabels, VideoResultProps } from "./components/VideoResult";
export { VideoResult } from "./components/VideoResult";
