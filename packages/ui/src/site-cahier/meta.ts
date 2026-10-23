import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Site Cahier",
  summary:
    "The template of a tool site (ui., java., ts., the motion lab) that wears krizaka.com's identity: the Cahier's paper, the site's own bird and hue, taped prints, doodles, grades — a frame and regions to compose, never a fixed page.",
  status: "beta",
  category: "templates",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." },
    desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." },
  },
  whenToUse: [
    "The home, the docs index, a documentation page or the changelog of an open-source tool of the family: Krizaka UI, Java, TypeScript, Motion.",
    "Any site of the family that should read as the same notebook as www.krizaka.com while keeping its own bird and its own accent.",
  ],
  whenNotToUse: [
    { when: "A product's marketing page, with its own brand and theme.", use: "product-page" },
    { when: "A plain landing page with no notebook identity.", use: "landing-page" },
  ],
  bestPractices: [
    "Adopt the language, not the layout: pick your own hero, your own featured pieces and your own rhythm — two tool sites must not look like one page with another name.",
    "One bird per site, by the brand reference: the falcon watches (security), the owl reads, the duck builds (code), the flamingo answers or gets paid, the pigeon delivers.",
    "Proposed mapping: Krizaka UI → duck, Java → owl, TypeScript → pigeon, Motion → flamingo. Each site also sets its own `hue`.",
    "Playful pieces stay refined: a doodle or a grade supports the content, which comes first and stays readable; every grade is measured, with its source.",
    "Pass the shared `NavBar` as `bar` when the site needs search or a language switch; the simple bar is for a small site.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `header` with a named `nav` (the page being read has `aria-current=\"page\"`), one `main` and the family footer's `footer`: render the template once per page and no other `main`.",
      "The bird in the bar and in the hero is decoration; the site's name is the link's text.",
      "Dark is chalk on slate and light is ink on paper, both at AA; the regions keep a phone layout and never scroll sideways.",
    ],
  },
  related: ["page-hero", "taped-photo", "bird-plate", "site-footer", "changelog-page", "doodle", "grade-stamp", "versus-card", "speed-lines"],
  web: {
    imports: ["SiteCahier", "SiteCahierHero", "SiteCahierDoc"],
    examples: [
      { name: "ui-home", title: "Krizaka UI — the duck builds", description: "A home that opens on the duck taped beside the title, a doodle arrow and a measured grade.", template: true, purpose: "convince", why: "A developer sees at once what the tool is, how well it is kept and where to start." },
      { name: "java-releases", title: "Java — the owl reads", description: "A home whose hero is a versus card of two releases, then the modules as specimen tags.", template: true, purpose: "show", why: "A maintainer compares two releases on real figures before upgrading." },
      { name: "motion-lab", title: "Motion — the flamingo answers", description: "A home whose hero is a live demo in a burst of speed lines, then taped prints.", template: true, purpose: "show", why: "A designer feels a motion primitive before reading about it." },
      { name: "ts-doc", title: "TypeScript — a documentation page", description: "A reading page on ruled paper with its contents beside it, a circled word and a margin note.", template: true, purpose: "explain", why: "A reader follows one guide from top to bottom and finds their place again." },
      { name: "ts-changelog", title: "TypeScript — the changelog", description: "The shared changelog template inside the Cahier's frame, under the pigeon's bar.", template: true, purpose: "explain", why: "A user checks what changed in each release and whether it concerns them." },
    ],
  },
} satisfies ComponentMeta;
