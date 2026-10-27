/* The inventory of /docs/ui (krizaka-com#115): for every component of the catalogue, why it is there.

   - used     a product imports it today — lib/ui-usage.json, a dated scan of the committed sources of the product
              repositories (`npm run ui:usage`); the "why" is the product that uses it.
   - planned  nobody imports it yet, and a piece of planned work needs it: it is listed below with that work.
   - remove   no product uses it and no planned work needs it: it is deprecated (registry `status: deprecated`, with
              the major that removes it), never silently kept.
   A component that is neither used nor listed here fails tests/docs-ia.test.mjs: a new component arrives with its
   reason, or with a product that uses it. Words here are English, like the component pages they sit beside. */

import usage from "./ui-usage.json" with { type: "json" };

export type Product = "orazaka" | "yomizaka" | "akinaza" | "krizaka";
export const PRODUCTS: readonly Product[] = ["orazaka", "yomizaka", "akinaza", "krizaka"];

export interface UsageSnapshot {
  scannedAt: string;
  repos: Record<string, { repo: string; commit: string; files: number }[]>;
  components: Record<string, Partial<Record<Product, number>>>;
}
export const USAGE = usage as UsageSnapshot;

/** Who imports a component today, products in a fixed order. */
export const usedBy = (name: string): Product[] => PRODUCTS.filter((product) => (USAGE.components[name]?.[product] ?? 0) > 0);

const MOBILE = "the native apps: Yomizaka and Akinaza mobile, Orazaka mobile";
const SITE = "krizaka.com migrating its pages to the specialised template (TPL)";
/** A component built for a product now paused (Orochia, Yasakia, Yororis, Kachizaka — 2026-10-25). */
const PAUSED = "Built for a product now paused (2026-10-25): kept until the next major's audit decides";
/** A component whose only users were the paused products: no product in focus imports it yet. */
const LEFT = "Its only users were products now paused (2026-10-25): kept until the next major's audit decides.";

/** Why an unused component stays: the planned work that needs it. */
export const PLANNED: Record<string, string> = {
  grid: `${MOBILE}: the dashboards, the galleries and the stat strips by size class (krizaka-ui#753; adoption yomizaka#430, akinaza#397).`,
  "list-detail": `${MOBILE}: messages, jobs and files as one pane on a phone and two on a tablet (krizaka-ui#753).`,
  "form-flow": `${MOBILE}: sign-up and the profile in steps (krizaka-ui#753, #741: Yomizaka and Akinaza switch to the native templates).`,
  "state-screen": `${MOBILE}: the empty, error and offline screens (krizaka-ui#753, #741).`,
  "desktop-window": "The Mac apps' window (Orazaka, Yomizaka, Akinaza; Tauri, ADR-002): three panes, the toolbar and the menu bar's commands (krizaka-ui#753).",
  "app-frame": "The one signed-in frame of Yomizaka, Akinaza and Orazaka (UX audit F1, F2; yomizaka#429, akinaza#396, orazaka-web-client#294).",
  elephant: `${PAUSED}: the small flying elephant of the neighbour joke.`,
  "activity-feed": "Orazaka's job history (the adoption of Elements, PS-E).",
  "media-grid": `${PAUSED}: a video feed — a shelf for the 9:16, a uniform grid for the 16:9.`,
  "audio-player": "Orazaka's speech studio (audio outputs).",
  captcha: "krizaka.com's contact form and the blog's newsletter form (the public forms, behind Cloudflare Turnstile).",
  "component-page": `${SITE}: the component pages of /docs.`,
  "contact-page": `${SITE}: /contact.`,
  shop: "Akinaza's public shop page and its composer: a page as a document of sections and variants (krizaka/akinaza#398, ADR-007, krizaka-ui#742).",
  wall: "Akinaza's shop pages: the owner's photos, short notes and logo on a textured wall (krizaka/akinaza#236, krizaka-ui#537).",
  "notification-preferences": "Akinaza's and Yomizaka's account baseline (notifications) (krizaka-ui#515).",
  "quota-meter": "Yomizaka's library quota and Akinaza's plan (krizaka-ui#515).",
  "margin-layout": "Yomizaka (krizaka/yomizaka#314) for its report and check flow, then any product that reads numbered findings.",
  usage: "Yomizaka « Crédits et usage » (krizaka/yomizaka#314), Akinaza's activity panel (akinaza#325); Orazaka moves onto it in its dispatch.",
  "analysis-report": "Yomizaka (the report of a check, krizaka/yomizaka#314), Orazaka's Studios, then every product that shows an Orazaka analysis.",
  "environment-notice": "Yomizaka (krizaka/yomizaka#364) on every surface of its dev deployment, then Akinaza and Orazaka.",
  "chip-row": "Yomizaka's « Pour qui ? » audience picker (krizaka/yomizaka home redesign, AudiencePicker moves into it), then any page of filters that are addresses.",
  "meta-row": `${PAUSED}: the quiet line under a video's title — quality, shape, duration, date, and an AI badge.`,
  "docs-layout": "Builds the documentation article template.",
  "text-style": "Akinaza storefronts: the shop owner sets the font, size and tone of the shop's titles and text (krizaka/akinaza#236); then the product theme settings of the admin consoles (krizaka-ui#561).",
  stuck: "The Cahier (ADR-004, krizaka-ui#554): the products' cards and figures stuck into the notebook on www.krizaka.com's #products.",
  doodle: "The Cahier (ADR-004, krizaka-ui#554 and #548): the margin doodles beside the stuck blocks of www.krizaka.com on a wide screen, and the inline marks and the bird's sketch on ui., java., ts. and the motion lab.",
  signature: "The Cahier (ADR-004, krizaka-ui#554): the house signs the end of a page of www.krizaka.com and ui.krizaka.com.",
  "grade-stamp": "The tool sites' homes (krizaka/krizaka-ui#548): a teacher's grade from real measures — coverage, Lighthouse — with its source.",
  "versus-card": "The tool sites (krizaka/krizaka-ui#548): Java's two-release face-off, the component and its alternative on ui.krizaka.com.",
  "speed-lines": "The tool sites (krizaka/krizaka-ui#548): the motion lab's live demo, then the heroes of the other tool sites.",
  "site-cahier": "The frame of ui.krizaka.com, java., ts. and the motion lab (one issue each, krizaka/krizaka-ui#548).",
  "bird-plate": "The Cahier (ADR-004): the flock and each product's bird with its promise on www.krizaka.com, then /story and the product sites.",
  "anatomy-plate": "The Cahier (ADR-004): the anatomy of each component on ui.krizaka.com/components/<name>.",
  "page-index": "The Cahier (ADR-004): the index of ui.krizaka.com's components, numbered like a reference book.",
  chapter: "The Cahier (ADR-004, krizaka-ui#617): the chapters of the story on blog.krizaka.com's home (ChapterIndex), the head and foot of each chapter's page.",
  "docs-nav": "Groups the pages in the documentation sidebar.",
  fab: `${MOBILE}: the main creation action of a list screen.`,
  "gallery-page": `${SITE}: the demo gallery.`,
  "comparison-table": "Orazaka's « The same AI. Different ownership. » on dev.orazaka.com (the landing restructure, krizaka/orazaka#183), and every product's « why us ».",
  showcase: "Orazaka's \"Prompt → image\" gallery on dev.orazaka.com (KZ-AUTOPLAY), and the demo galleries of the products.",
  "how-it-works-page": `${SITE}: the "how it works" pages of the products.`,
  kanban: `${PAUSED}: a moderation queue (to review, reviewing, resolved), moved by keyboard as well as by drag.`,
  "image-viewer": `${MOBILE}: full-screen photos of a profile or a gallery.`,
  iso: "The product heroes on dev.orazaka.com (IsoHub), which left krizaka.com with the product pages (#150).",
  "longform-page": `${SITE}: /story.`,
  "marketing-layout": `${SITE}: the frame of every public page.`,
  onboarding: `${MOBILE}: first launch and profile set-up flows.`,
  "otp-input": `${MOBILE}: the code of a sign-in or a phone check.`,
  "update-prompt": "krizaka/.github#75: the soft update of Orazaka mobile and of the Mac app.",
  "permission-prompt": `${MOBILE}: asking for the camera, the location, notifications — in words, before the system dialog.`,
  "photo-grid": `${PAUSED}: people screens and creator pages.`,
  "pointer-light": "Deprecated (krizaka-ui#393): the light that followed the pointer is retired.",
  "pricing-page": `${SITE}: /pricing of the products.`,
  "product-page": `${SITE}: the product pages.`,
  "pull-to-refresh": `${MOBILE}: lists and feeds (and BrandedRefresh, krizaka-ui#137).`,
  recipes: "Builds the web and native variants of the primitives from one recipe (nativeRecipe, PS4): every component that exists on both platforms.",
  separator: "A primitive of the platform: dividers inside menus, lists and cards.",
  slot: "The `asChild` mechanism: every primitive that renders your own link or element is built on it.",
  "splash-handoff": `${MOBILE}: the launch screen that dissolves into the product mark (krizaka-ui#137).`,
  "status-page": `${SITE}: /status and the "under construction" pages.`,
  "step-progress": `${MOBILE}: the head of their sign-up and onboarding flows.`,
  "swipeable-row": `${MOBILE}: archive / delete on a row of a list.`,
  "tag-input": "Free tags in the form: Orazaka's pack metadata.",
  reviews: "Akinaza's shop pages (krizaka/akinaza#313): the shop's verified score and its review cards.",
  "embed-facade": "Akinaza's shop pages (krizaka/akinaza#312): the latest TikTok, YouTube Shorts or Instagram reel behind a click, nothing third-party before it.",
  "retro-tv": "Akinaza's shop pages: a vertical reel or behind-the-scenes story displayed in the shop's television cabinet.",
  "video-player": "The products' tours: the demos moved to the product sites with the showcase (#150).",
  virtual: "The data table and the long lists are built on it.",
  // @krizaka/charts — what the products will draw (PS-C: creator revenue, credits, latency, funnel, goal gauge, KPI sparkline, activity heat map, geo map).
  "area-chart": "Revenue and latency over time (PS-C).",
  "calendar-heatmap": "A creator's activity by day (PS-C).",
  funnel: `${PAUSED}: a sign-up and purchase funnel (PS-C).`,
  "geo-map": "Audience by region, on MapLibre (PS-C).",
  "credit-usage": "Orazaka's credits left (PS-C ready-made charts).",
  "earnings-chart": `${PAUSED}: a creator's earnings per period (PS-C).`,
  "goal-progress": `${PAUSED}: a pot raised towards its goal (PS-C).`,
  "job-throughput": "Orazaka's jobs per period by status (PS-C).",
  "latency-chart": "Orazaka's median and p95 latency per studio (PS-C).",
  "price-ticker": `${PAUSED}: a live auction price (PS-C).`,
  chart: "The base the other charts are built on.",
  "chart-card": "The one frame of every chart of Orazaka's dashboard and usage pages (#253).",
  "kpi-explained": "Akinaza's shop dashboard: monthly sales, spend and margin explained with their source and cadence; Orazaka later.",
  "next-actions": "Akinaza's Today and shop dashboard: the two or three highest-impact actions from bookings, stock and payments; Orazaka later.",
  glossary: "Akinaza's owner dashboard: a short reference for commerce terms alongside its explained figures.",
  "glossary-term": "Akinaza's inline explanations of accounting and booking terms, without sending a shop owner away.",
  achievement: LEFT,
  countdown: LEFT,
  "goal-gauge": LEFT,
  marquee: LEFT,
  pagination: LEFT,
  "profile-card": LEFT,
  slider: LEFT,
  "stage-banner": LEFT,
  "verified-badge": LEFT,
  "vertical-video": LEFT,
  gauge: LEFT,
  "line-chart": LEFT,
};

/** Charts no product will draw: retired by PS-C (the @krizaka/charts major), listed so the removal is a decision. */
export const RETIRED: Record<string, string> = {
  candlestick: "A financial chart: no product shows prices over time. Removed in the next major of @krizaka/charts (PS-C).",
  globe: "A 3D globe: heavy, decorative, and the geo map on MapLibre replaces it. Removed with PS-C.",
  heatmap: "Merged into the calendar heat map, which is the one the products need. Removed with PS-C.",
  "radar-chart": "No product compares profiles on axes. Removed with PS-C.",
  sankey: "No product follows flows between stages; the funnel does. Removed with PS-C.",
  "scatter-chart": "No product plots two measures against each other. Removed with PS-C.",
  treemap: "No product shows a part-to-whole hierarchy. Removed with PS-C.",
};

export type InventoryState = "used" | "planned" | "removal";

export interface Inventory {
  state: InventoryState;
  /** One line: who uses it, what needs it, or why it goes. */
  why: string;
  usedBy: Product[];
}

/** The decision on one component: used (and by whom), planned (and for what), or on its way out (and why). */
export function inventoryOf(name: string, status: string, deprecated?: { reason?: string; removedIn?: string } | null): Inventory | null {
  const users = usedBy(name);
  if (status === "deprecated") return { state: "removal", why: deprecated?.reason ?? RETIRED[name] ?? "", usedBy: users };
  if (RETIRED[name]) return { state: "removal", why: RETIRED[name], usedBy: users };
  if (users.length > 0) return { state: "used", why: `Used by ${users.map((p) => PRODUCT_NAMES[p]).join(", ")}.`, usedBy: users };
  const plan = PLANNED[name];
  return plan ? { state: "planned", why: plan, usedBy: [] } : null;
}

export const PRODUCT_NAMES: Record<Product, string> = { orazaka: "Orazaka", yomizaka: "Yomizaka", akinaza: "Akinaza", krizaka: "krizaka.com" };
