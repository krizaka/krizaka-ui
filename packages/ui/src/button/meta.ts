import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Button",
  summary: "The action: a button in six looks (primary, gradient, secondary, outline, ghost, danger), three sizes and two shapes.",
  status: "stable",
  category: "actions",
  platforms: "both",
  whenToUse: [
    "To run an action: submit a form, open a dialog, start an upload, save a draft.",
    "One `primary` button for the main action of a view; `secondary`, `outline` or `ghost` for the others.",
    "`IconButton` for a compact action shown by its icon alone (close, add, more), with a `label` for its name.",
  ],
  whenNotToUse: [
    { when: "To go to another page: use a link (`asChild` with your router's `<Link>` keeps the button look)." },
    { when: "To turn a setting on or off, with an immediate effect.", use: "switch" },
    { when: "For a destructive action that needs a second press to confirm, in place.", use: "confirm-button" },
    { when: "To choose one option among several, or filter a list.", use: "chip" },
  ],
  bestPractices: [
    "Name the action with a verb: “Save”, “Send the invitation” — not “OK” or “Yes”.",
    "One primary per view; the danger variant only for what destroys or cannot be undone.",
    "`loading` while the action runs: the button is disabled and says it is busy; keep its width by keeping its words short.",
    "Style a link without the component with `buttonVariants({ variant, size })`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "Runs the action." },
      { keys: "Tab", action: "Moves the focus to the next control; the focus ring uses `--kz-ring`." },
    ],
    notes: [
      "A native `<button type=\"button\">`: the role, the focus and the keyboard come from the platform.",
      "`IconButton` requires `label`: it becomes the `aria-label` of a button that shows no text.",
      "`loading` sets `aria-busy` and disables the button; `disabled` keeps it out of the tab order.",
    ],
  },
  related: ["confirm-button", "dialog", "dropdown-menu", "tooltip"],
  web: {
    imports: ["Button", "IconButton"],
    examples: [
      { name: "primary", title: "Primary", description: "The main action of a view: the accent." },
      { name: "gradient", title: "Gradient", description: "The brand's signature, accent → accent-2: a hero or a closing call to action, once per page." },
      { name: "secondary", title: "Secondary", description: "The default: a raised surface, for the other actions." },
      { name: "outline", title: "Outline", description: "A lighter action next to a primary one." },
      { name: "ghost", title: "Ghost", description: "In toolbars and dense lists: no frame until hovered." },
      { name: "danger", title: "Danger", description: "A destructive action: the border and the tint carry the danger, the label stays legible in both themes." },
      { name: "sizes", title: "Sizes", description: "`sm`, `md` (default) and `lg`." },
      { name: "pill", title: "Pill", description: "`shape=\"pill\"`: fully rounded." },
      { name: "disabled", title: "Disabled", description: "Not available yet: out of the tab order." },
      { name: "loading", title: "Loading", description: "While the action runs: disabled, `aria-busy`, `data-loading`." },
      { name: "as-child-link", title: "As a link", description: "`asChild` renders your `<a>` (or router link) with the button's look." },
      { name: "icon", title: "Icon button", description: "`IconButton`: a square button holding an icon; `label` is its accessible name." },
    ],
  },
  native: {
    imports: ["Button", "IconButton"],
    differences: [
      "The text is the `label` prop (a string), not children: it is also the accessible name.",
      "`onPress` instead of `onClick` (a `Pressable`); haptics, if any, belong to your `onPress`.",
      "`icon` places an icon before the label; there is no `asChild`.",
      "`loading` shows the platform's `ActivityIndicator` in place of the icon.",
      "`variant=\"gradient\"` draws its fill with react-native-svg (React Native has no CSS gradient).",
    ],
    examples: [
      { name: "primary", title: "Primary", description: "The main action of a screen." },
      { name: "gradient", title: "Gradient", description: "accent → accent-2, drawn with react-native-svg: the hero action of a screen." },
      { name: "secondary", title: "Secondary", description: "The default look." },
      { name: "outline", title: "Outline", description: "A lighter action." },
      { name: "ghost", title: "Ghost", description: "No frame: toolbars, headers." },
      { name: "danger", title: "Danger", description: "A destructive action." },
      { name: "sizes", title: "Sizes", description: "`sm`, `md`, `lg`, and `shape=\"pill\"`." },
      { name: "icon", title: "With an icon", description: "`icon` before the label." },
      { name: "disabled", title: "Disabled", description: "Not available yet." },
      { name: "loading", title: "Loading", description: "Disabled and busy, a spinner in place of the icon." },
      { name: "icon-only", title: "Icon button", description: "`IconButton`: `label` is required, it is the accessible name." },
    ],
  },
} satisfies ComponentMeta;
