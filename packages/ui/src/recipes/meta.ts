import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Recipes",
  summary:
    "The variants of a component written once, as classes of the Krizaka tokens: the web wears them with `tv(recipe)`, React Native reads the same classes into styles on the theme's roles with `nativeRecipe(recipe).resolve(props, theme)`. Button, Badge, Chip and Card are built this way, so the two platforms cannot name different tokens.",
  status: "beta",
  category: "foundations",
  platforms: "web",
  whenToUse: [
    "A component that exists on the web and on the phone, whose variants (a look, a size, a tone) must stay the same on both.",
    "A product composite that adds variants to a primitive and wants its React Native twin to follow.",
  ],
  whenNotToUse: [
    { when: "To merge class names on the web: `cn` does that.", use: "cn" },
    { when: "For a component that has a web side only: write `tv({ … })` as the primitives do." },
    { when: "For the layout, the pointer and focus states, shadows and transitions: they stay on the web side of the recipe, the phone ignores them." },
  ],
  bestPractices: [
    "Write colours as roles (`bg-accent`, `text-fg-secondary`, `border-border-default`, `ring-accent/40`) and sizes in Tailwind units (`h-10`, `px-4`, `text-sm`, `text-[11px]`): those are what the phone can read.",
    "Sizes are a variant dimension; states are prefixes: `hover:` is for the pointer (web only), `disabled:` and `data-[state=on]:` are read on both.",
    "Keep what the phone draws differently in its component (the radius of a shape, the pressed opacity, a shadow): the recipe holds colours, sizes and type.",
    "Check the pair in a test: resolve every variant on both themes and fail on a class that is neither mapped nor declared web-only (see `recipes.test.ts`).",
    "Pass the native theme to `resolve` (`useTheme().theme`) and wrap the result in `StyleSheet` in the component; the recipe itself imports nothing from React Native.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A recipe only carries colours and sizes: the contrast of each pair is the tokens' (text roles ≥ 4.5:1 on the surfaces they are meant for, tested in @krizaka/tokens).",
      "Focus rings and the pointer's states are web classes and stay on the web side; a phone has the platform's own focus and press feedback.",
    ],
  },
  related: ["button", "badge", "chip", "card", "cn"],
  web: {
    imports: ["defineRecipe", "nativeRecipe", "withAlpha", "ROLES"],
    examples: [{ name: "tone-chip", title: "What the phone reads", description: "A recipe of two tones and two sizes, and what `nativeRecipe` reads from its classes: points, colours on a theme, and the classes only the web has." }],
  },
} satisfies ComponentMeta;
