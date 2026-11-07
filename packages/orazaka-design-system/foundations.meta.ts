// The foundations of the Orazaka kit, as krizaka.com/docs/orazaka/ui/foundations shows them. The values are not
// here: `scripts/build-registry.mjs` reads them from src/theme.css and @krizaka/tokens (the roles, both modes, the
// named themes, their contrasts, the type scale) into `registry/foundations.json`. This file holds what values cannot
// say — names, uses, and the product rules, each one quoted from the contract that states it (never invented here).

const CONTRACT = "https://github.com/krizaka/orazaka/blob/main/AGENTS.md";
const UI_RULES = "https://github.com/krizaka/orazaka/blob/main/.agent/rules/ui_standards.md";
const KIT = "https://github.com/krizaka/krizaka-ui/blob/main/packages/orazaka-design-system/AGENTS.md";

export const foundations = {
  theme: "Orazaka Orange",
  summary:
    "Calm obsidian surfaces — the platform's, the krizaka.com values — and the orange of the Orazaka mark as the accent, from the Orazaka brand of @krizaka/tokens. Five named themes sit beside it, orthogonal to dark and light. A theme is a set of token values: theme.css overrides the `--kz-*` roles, so every @krizaka/ui primitive wears Orazaka without a class of its own.",
  modes: { dark: "Orazaka Orange — dark", light: "Orazaka Orange — light" },
  roles: {
    accent: "The Orazaka orange: primary actions, the active state, the sent bubble.",
    "accent-hover": "The accent under the pointer.",
    "accent-soft": "An orange wash behind an active item or a pipeline chip.",
    "accent-text": "The orange as text: links, active labels — AA on every surface.",
    "accent-2": "The second stop of the buttons' gradient.",
    "on-accent": "Text on the accent: near-black in dark, white in light.",
    ring: "The focus ring, in the accent.",
    info: 'Blue, not orange: an orange "info" would read as a warning.',
  },
  namedThemes: {
    electric: { name: "Electric Blue", use: "The 2.x identity, kept for the users who chose it." },
    custom: { name: "Deep Violet", use: "A violet night theme." },
    cyberpunk: { name: "Neon Matrix", use: "Neon green text on violet black, magenta accent." },
    solarized: { name: "Warm Parchment", use: "A light theme on parchment surfaces." },
    krizaka: { name: "Obsidian Razor", use: "Pitch-black surfaces, zero radius, a cold-steel accent." },
  },
  productTokens: {
    "--orazaka-grid-color": "The faint grid behind the console and the landing sections.",
    "--orazaka-accent-glow": "The soft accent halo around a focused composer or card.",
    "--orazaka-space-card": "The fluid padding of a card.",
    "--orazaka-space-section": "The fluid gap between sections.",
  },
  typography: [
    {
      role: "Display",
      family: "Outfit",
      token: "--kz-font-display",
      use: "Headings and figures (`h1`, `h2`, `.text-display`) — Krizaka Display when the app loads it.",
    },
    { role: "Body", family: "Inter", token: "--kz-font-sans", use: "Interface and reading text." },
    {
      role: "Mono",
      family: "JetBrains Mono",
      token: "--kz-font-mono",
      use: "Data tables, console nodes, prompt streams, model names.",
    },
  ],
  icons: [
    {
      name: "SovkoraLogo",
      from: "@krizaka/ui",
      use: "The brand mark, in the brand's orange — never a placeholder icon.",
    },
    {
      name: "Icon",
      from: "@krizaka/orazaka-design-system",
      use: "The icon registry: every icon of an Orazaka screen, one typed name per concept; no app imports an icon library.",
    },
    {
      name: "SentinelMini",
      from: "@krizaka/orazaka-design-system",
      use: "The Sentinel, the guardian of the pipeline, at 24 px.",
    },
  ],
  rules: [
    {
      title: "Sovereign by design",
      text: "Local-first: AI inference runs on the organisation's machines, never in an unsolicited cloud; no network dependency is introduced without being asked. The showcases say it: answered locally, nothing left the network.",
      source: { label: "Orazaka AGENTS.md §0 and §13", url: CONTRACT },
    },
    {
      title: "The browser never reaches the engine",
      text: "A web page never calls the router or the model runtime directly: all browser traffic goes through the app's server routes (the BFF).",
      source: { label: "Orazaka AGENTS.md §8", url: CONTRACT },
    },
    {
      title: "A persona, not an admin",
      text: "Examples, showcases and recordings speak as a named person with a real need (Eric, finance lead), in a fictional but believable workspace — never an admin account or an internal label.",
      source: { label: "orazaka-design-system AGENTS.md", url: KIT },
    },
    {
      title: "Input locks while the engine works",
      text: "Text entry surfaces lock while sending or generating: textareas, menus, attachments and submit buttons are disabled (ERR-126).",
      source: { label: "ui_standards §5", url: UI_RULES },
    },
    {
      title: "Every state, every size",
      text: "Every interactive element has hover, active, focus and disabled states; mobile-first layouts with touch targets of at least 44 px; an `aria-label` on every icon-only button.",
      source: { label: "ui_standards §1 and §3", url: UI_RULES },
    },
    {
      title: "No hard-coded words or colours",
      text: "No JSX text: every string comes from the translation dictionary (room for +30 % in French). Colours are roles: no inline hex, no palette class.",
      source: { label: "ui_standards §1 and §3", url: UI_RULES },
    },
  ],
  native: {
    summary:
      "The mobile app has its own React Native components and takes the same tokens from `@krizaka/orazaka-shared` — the Orazaka orange of @krizaka/tokens/native.",
    code: `import { themes, tokens } from "@krizaka/orazaka-shared";

const t = themes[colorScheme === "light" ? "light" : "dark"];
// t.accent, t.surface1, t.textPrimary…`,
  },
} as const;
