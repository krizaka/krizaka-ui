/* The home's scene (« Built with it »): what each product's two screens show — the figures, the curve, the rows' data and
   the phone. Structure and numbers only; every word is a message (landing.scene.products.<id>). The figures are a
   product's demo data (fictional, honest in kind), never claims about Krizaka. */

export const SCENE_IDS = ["krizaka", "orazaka", "orochia", "yomizaka"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export type Tone = "accent" | "success" | "warning" | "danger";

export interface SceneData {
  /** The product's dev address, shown in the window's bar. */
  url: string;
  /** Which nav item is the current page. */
  current: number;
  /** The three figures, formatted as the product shows them. */
  stats: [string, string, string];
  /** The curve: one value per point (the x labels are the product's own, below). */
  curve: { x: string; value: number }[];
  /** How the curve's values read. */
  format: { style: "money"; currency: string } | { style: "number"; options: Intl.NumberFormatOptions };
  /** The table's rows: the detail cell (data, not words) and the badge tone of each state. */
  rows: { detail: string; tone: Tone }[];
  /** What the phone shows. */
  phone: "chat" | "video" | "document";
}

const hours = (values: number[]) => values.map((value, i) => ({ x: `${String(8 + i).padStart(2, "0")}:00`, value }));
const months = (values: number[]) => values.map((value, i) => ({ x: `2026-${String(4 + i).padStart(2, "0")}`, value }));
const days = (values: number[]) => values.map((value, i) => ({ x: `2026-10-${String(5 + i).padStart(2, "0")}`, value }));

export const SCENE: Record<SceneId, SceneData> = {
  orazaka: {
    url: "dev.orazaka.com/jobs",
    current: 2,
    stats: ["1,284", "312", "$4.12"],
    curve: hours([42, 58, 51, 77, 96, 88, 112, 131, 118, 146]),
    format: { style: "number", options: { maximumFractionDigits: 0 } },
    rows: [{ detail: "Whisper large", tone: "accent" }, { detail: "Llama 3.3", tone: "success" }, { detail: "XTTS v2", tone: "danger" }],
    phone: "chat",
  },
  orochia: {
    url: "dev.orochia.com/studio",
    current: 2,
    stats: ["CA$3,420", "128", "48.2K"],
    curve: months([182_000, 164_000, 231_000, 298_000, 276_000, 342_000]),
    format: { style: "money", currency: "CAD" },
    rows: [{ detail: "3", tone: "accent" }, { detail: "42", tone: "success" }, { detail: "0", tone: "warning" }],
    phone: "video",
  },
  yomizaka: {
    url: "dev.yomizaka.com/documents",
    current: 1,
    stats: ["214", "9", "TAL"],
    curve: days([22, 31, 28, 44, 39, 52, 47]),
    format: { style: "number", options: { maximumFractionDigits: 0 } },
    rows: [{ detail: "PDF · 14 p.", tone: "warning" }, { detail: "PDF · 6 p.", tone: "success" }, { detail: "PNG · 1 p.", tone: "success" }],
    phone: "document",
  },
  krizaka: {
    url: "console.example.com",
    current: 0,
    stats: ["12", "8", "99.98 %"],
    curve: days([1_820, 1_910, 1_760, 2_140, 2_380, 2_260, 2_520]),
    format: { style: "number", options: { maximumFractionDigits: 0 } },
    rows: [{ detail: "production", tone: "success" }, { detail: "staging", tone: "accent" }, { detail: "production", tone: "warning" }],
    phone: "chat",
  },
};
