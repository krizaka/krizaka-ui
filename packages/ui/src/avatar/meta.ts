import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Avatar",
  summary: "A person or an account: their picture, or initials while it loads, when it fails or when there is none.",
  status: "stable",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Next to a name: comments, creators, members, the signed-in account in a header.",
    "`Avatar.Group` to show who takes part (followers, collaborators) in little space.",
  ],
  whenNotToUse: [
    { when: "For a product, a video or a place: use an image in a card.", use: "card" },
    { when: "As the only way to say who someone is: show their name too, or give the avatar an `alt`." },
  ],
  bestPractices: [
    "Always pass a `fallback` (initials) on the web: images fail, and the layout should not jump.",
    "A profile can lack a photo: pass `defaultAvatar={{ brand, seed: user.id }}` and the person gets the product's own default picture (a silhouette on the brand's gradient, one of six tones, always the same for the same id) instead of an empty circle. It also replaces a photo that fails to load. `fallbackSrc` is the same for your own image; `kind: \"plain\"` is the gradient alone, for initials.",
    "`defaultAvatar.kind` is what the picture is of: `person` (default, a silhouette), `folder`, `organisation` or `shop` (a glyph on the gradient, drawn in the page, never a person). A folder, a company or a shop never gets a silhouette. The central sets of those kinds, and the founder's illustrated people and banners, are in the Krizaka org JSON (`defaults` of `@krizaka/org`): an app lists and picks them from there, it never bundles or hard-codes a default media URL.",
    "The default pictures are generated from the code (`defaultAvatarSvg`) and served by the Krizaka CDN (`defaultAvatarUrl`, 256 and 512 px WebP, SVG): a product never draws its own.",
    "Use one size per list: `sm` in dense lists, `md` by default, `lg`/`xl` on a profile.",
    "In a group, set `max` so a long list ends with `+n` instead of overflowing.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "With `alt`, the picture is an image named by it; without `alt`, it is decorative — put the name in the text next to it.",
      "The fallback initials are shown, not announced, when an `alt` names the person.",
    ],
  },
  related: ["card", "badge", "skeleton"],
  web: {
    imports: ["Avatar"],
    examples: [
      { name: "with-image", title: "With an image", description: "A picture named by `alt`, with initials as `fallback`." },
      { name: "default", title: "Default pictures", description: "No photo: `defaultAvatar={{ brand, seed }}` — the brand's gradient and a silhouette, one of six tones per person." },
      { name: "fallback", title: "Fallback", description: "No image: the initials." },
      { name: "sizes", title: "Sizes", description: "`xs`, `sm`, `md` (default), `lg`, `xl`." },
      { name: "group", title: "Group", description: "`Avatar.Group` with `max`: the others become `+n`." },
    ],
  },
  native: {
    imports: ["Avatar"],
    differences: [
      "The fallback is the initial of `alt` when `fallback` is not given.",
      "`size` also takes a number of points.",
      "`defaultAvatar` and `fallbackSrc` work as on the web (the default pictures are WebP, drawn by `Image`); `defaultAvatarUrl` is exported from `@krizaka/ui/native`.",
      "`src` is a URI string (an `Image` source), not a URL object.",
      "An SVG `src` (`….svg`, `data:image/svg+xml,…`, or any URI with `svg`) is drawn by react-native-svg — `Image` cannot.",
      "`presence` adds a dot (online, away, busy, offline) and `ring` a story ring (new, seen, live): mobile only for now.",
    ],
    examples: [
      { name: "sizes", title: "Sizes", description: "Without an image: the initial of `alt`, from `xs` to `xl`." },
      { name: "group", title: "Group", description: "`Avatar.Group max={3}`: the rest becomes `+n`." },
      { name: "presence", title: "Presence and story rings", description: "A presence dot, a story ring (new or seen), said with the name." },
    ],
  },
} satisfies ComponentMeta;
