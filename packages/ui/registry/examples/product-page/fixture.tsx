import { ProductPage, type ProductPageData } from "@krizaka/ui/product-page";

// A fictional product, assembled from data only: every word, medium and verdict below is the product's; the blocks hold
// none of them and the colour is the brand scope.
const poster = "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg";
const film = { mp4: "https://krizaka-assets.b-cdn.net/org/v1/films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4" };
const lines = [
  { text: "The tenant pays the rent on the first day of the month." },
  { text: "The tenant pays a deposit of two months of rent.", flagged: true },
  { text: "Pets are allowed with the landlord's consent." },
  { text: "The lease renews itself for twelve months." },
];

const data: ProductPageData = {
  brand: "verikora",
  hero: {
    title: "Find the clauses to review before you send.",
    lead: "Each finding shows the line of the lease and its article of law.",
    primary: { href: "#demo", label: "Ask for a demo" },
    secondary: { href: "#report", label: "See a report" },
    backdrop: poster,
  },
  moment: {
    label: "A fictional lease, read, one clause found",
    tag: "Fictional lease",
    lines,
    finding: { verdict: "To check", tone: "danger", title: "A deposit cannot be asked for.", reference: "Civil Code, art. 1904" },
  },
  story: {
    label: "How a lease is checked",
    guide: "owl",
    steps: [
      { id: "arrive", title: "The file arrives.", cue: "arrive" },
      { id: "read", title: "Every line is read.", cue: "read", mood: "thinking" },
      { id: "light", title: "One clause lights up.", cue: "light", light: "danger", mood: "thinking" },
      { id: "attach", title: "Its article attaches.", cue: "attach", light: "accent-2" },
      { id: "decide", title: "You decide.", cue: "decide", mood: "success" },
    ],
    scene: {
      lines,
      reference: "Civil Code, art. 1904",
      decision: { title: "A deposit cannot be asked for.", primary: "Review the clause", secondary: "Keep it", stamp: "Decision noted" },
    },
  },
  demo: {
    title: "Touch a clause.",
    tag: "Fictional lease",
    lines: [
      { id: "rent", text: "The rent is paid on the first day of the month.", finding: { verdict: "Fine", tone: "success", title: "Nothing to change.", reference: "Civil Code, art. 1903" } },
      { id: "deposit", text: "A deposit of two months of rent.", finding: { verdict: "To check", tone: "danger", title: "A deposit cannot be asked for.", quote: "two months of rent", reference: "Civil Code, art. 1904" } },
      { id: "keys", text: "The keys are given on the first day." },
    ],
  },
  scenes: {
    labels: { pause: "Pause the scene", play: "Play the scene" },
    items: [
      { id: "binder", title: "The file, in order.", line: "Every document of a tenant in one place.", device: "browser", poster, sources: film, width: 16, height: 9, focus: { x: 0.3, y: 0.4, zoom: 1.8 } },
      { id: "report", title: "The report, shared.", line: "One link, read on any screen.", device: "desktop", poster, sources: film, width: 16, height: 9 },
    ],
  },
  limits: {
    title: "What it does not do",
    items: ["It does not decide. You do.", "It is not legal advice.", "It reads only what you give it."],
    bird: "owl",
    caption: "Fig. 1 · the owl, reads what you give it",
  },
  closing: { title: "See it on", inked: "a lease.", action: { href: "#demo", label: "Ask for a demo" } },
  footer: {
    current: "krizaka",
    family: false,
    config: {
      label: "Footer",
      columns: [{ id: "product", title: "Product", links: [{ label: "Pricing", href: "#pricing" }, { label: "Security", href: "#security" }] }],
      legal: { legalName: "Example Inc.", city: "Montréal (Québec)", showVersion: false, links: [{ label: "Privacy", href: "#privacy" }] },
    },
  },
};

export default function ProductPageFixture() {
  return <ProductPage data={data} />;
}
