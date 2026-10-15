// @krizaka/ui/avatar/defaults — the default pictures' pure helpers, SERVER-SAFE: no "use client", no React.
// `defaultAvatarUrl(…)` can be called in a Server Component; `@krizaka/ui/avatar` (a client entry) re-exports the same
// functions for client code, but calling them from the server through it fails ("Attempted to call … from the server").
export {
  DEFAULT_AVATAR_BASE,
  DEFAULT_AVATAR_BRANDS,
  DEFAULT_AVATAR_KINDS,
  DEFAULT_AVATAR_SIZES,
  DEFAULT_AVATAR_TONES,
  type DefaultAvatar,
  type DefaultAvatarBrand,
  defaultAvatarFile,
  type DefaultAvatarKind,
  type DefaultAvatarSize,
  defaultAvatarSvg,
  defaultAvatarTone,
  defaultAvatarToneOf,
  defaultAvatarUrl,
} from "./default-avatar";
