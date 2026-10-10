# @krizaka/icons

**The Krizaka signature icons.** 70 icons drawn for the Krizaka products — the vocabulary of Orochia (tips, unlocks,
auctions, challenges, 24 h stories, payouts, the 90 % share) and of Orazaka (sovereign chat, agents, studio, packs,
automations, knowledge, local and self-hosted) plus the usual interface — in one drawing language. React
(tree-shakable, server-safe) and React Native (react-native-svg), the same names and drawings.

[![npm](https://img.shields.io/npm/v/@krizaka/icons?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/icons)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)

## Install

```bash
npm install @krizaka/icons
# React Native: react-native-svg is a peer dependency
```

```tsx
import { ChatIcon, Story24hIcon } from "@krizaka/icons";

<ChatIcon />                                        // decorative: aria-hidden, 24 px, currentColor
<ChatIcon title="Sovereign chat" size={20} />        // an image with an accessible name
<Story24hIcon nodeColor="var(--kz-accent)" />        // the node lit with the brand accent
<button className="text-fg-secondary hover:text-fg"><SearchIcon size={18} /></button>  // colour = the text role

import { ChatIcon as NativeChatIcon } from "@krizaka/icons/native";
const { theme } = useTheme();
<NativeChatIcon color={theme.textPrimary} nodeColor={theme.accent} title="Chat" />
```

| Entry | Gives |
| :-- | :-- |
| `@krizaka/icons` | `<Name>Icon` (React, `forwardRef` to the `<svg>`), `createIcon`, `IconProps`, `Glyph`. |
| `@krizaka/icons/native` | `<Name>Icon` (react-native-svg), `createNativeIcon`, `NativeIconProps`. |
| `@krizaka/icons/glyphs` | The raw glyphs (`chat`, `tip`…) and `glyphIndex` (component, group, keywords): catalogues, search, canvas. |

**Props** (web): `size` (24), `strokeWidth` (1.75), `title`, `nodeColor` (`currentColor`), and every SVG attribute
(`className`, `style`, `aria-*`…). Native: `size`, `color`, `strokeWidth`, `title`, `nodeColor`.

## Style — the signature

- **Grid 24**, live area 2–22, **stroke 1.75**, round caps and joins; one weight across the set.
- **Cut corners.** Containers (cards, screens, wallet, server, calendar…) have 45° chamfers where other sets round
  them: the angle of the Krizaka hexagon, which also shapes the creator, pack, credits, settings and info glyphs.
- **The node.** Every product icon has one filled dot — the core of the Krizaka, Orazaka and Orochia marks — at its
  meaningful point (the message's voice, the auction's hammer head, the story's open end, the payout's balance). It
  takes the icon's colour, or the brand accent with `nodeColor`. Utility glyphs (arrows, chevrons, close, plus, check,
  menu) stay bare, so the nodes stay meaningful.
- No currency sign, no brand logo inside an icon: words and amounts come from the product.

The drawing is code: `scripts/glyphs.mjs` (helpers `cut`, `hex`, `arc`) → `pnpm glyphs` writes `src/glyphs.ts`,
`src/icons.ts`, `src/native/icons.ts`. Never edit those three by hand; a test regenerates and compares them.

## The set

| Group | Icons |
| :-- | :-- |
| product (31) | `TipIcon` · `UnlockIcon` · `PaidIcon` · `AuctionIcon` · `ChallengeIcon` · `GoalIcon` · `CreatorIcon` · `StoryIcon` · `Story24hIcon` · `PayoutIcon` · `WalletIcon` · `Share90Icon` · `LockIcon` · `FollowIcon` · `MessageIcon` · `UploadIcon` · `VideoIcon` · `ImageIcon` · `HeartIcon` · `ChatIcon` · `AiIcon` · `AgentIcon` · `StudioIcon` · `PackIcon` · `AutomationIcon` · `KnowledgeIcon` · `ShieldIcon` · `LocalIcon` · `ServerIcon` · `BillingIcon` · `CreditsIcon` |
| system (15) | `ThemeIcon` · `SunIcon` · `MoonIcon` · `SearchIcon` · `SettingsIcon` · `NotificationIcon` · `UserIcon` · `UsersIcon` · `CalendarIcon` · `ClockIcon` · `GlobeIcon` · `EyeIcon` · `EyeOffIcon` · `InfoIcon` · `WarningIcon` |
| interface (24) | `PlayIcon` · `PauseIcon` · `HomeIcon` · `MenuIcon` · `CloseIcon` · `BackIcon` · `ForwardIcon` · `ChevronDownIcon` · `ChevronRightIcon` · `PlusIcon` · `CheckIcon` · `MoreIcon` · `ExternalIcon` · `LinkIcon` · `FilterIcon` · `EditIcon` · `TrashIcon` · `CopyIcon` · `DownloadIcon` · `LogoutIcon` · `BookmarkIcon` · `SoundIcon` · `MuteIcon` · `FlagIcon` |

Catalogue (dark, light, every brand): Storybook, *Icons/Catalogue* and *Icons/Native*.

## Size

One icon ≈ 0.55 kB gzip (the factory included); every icon ≈ 4.1 kB. Each icon is a `/* @__PURE__ */` call: a bundler
keeps only what the app imports.

## License

Apache-2.0 © Krizaka
