import { samplePdf } from "../test/sample-pdf";
import { fold, locateQuote, type PageText, type TextItem } from "./index";

const item = (str: string, x: number, baseline: number, width: number, height = 12): TextItem => ({ str, transform: [height, 0, 0, height, x, baseline], width, height });
const page = (n: number, items: TextItem[]): PageText => ({ page: n, width: 600, height: 800, items });

describe("fold", () => {
  it("drops whitespace, accents, case and soft hyphens, and straightens quotes", () => {
    expect(fold("Le dépôt de  garan­tie")).toBe("ledepotdegarantie");
    expect(fold("l’article « 1 »")).toBe("l'article\"1\"");
  });
});

describe("locateQuote", () => {
  const pages = [
    page(1, [item("BAIL RESIDENTIEL", 72, 700, 150)]),
    page(2, [item("Le locateur peut augmenter", 72, 600, 200), item("le loyer à tout moment.", 72, 586, 160), item("Autre clause.", 72, 540, 80)]),
  ];

  it("finds a quote on its page and gives one box per line, in fractions of the page", () => {
    const found = locateQuote(pages, "Le locateur peut augmenter le loyer à tout moment.")!;
    expect(found).toMatchObject({ page: 2, match: "exact" });
    expect(found.boxes).toHaveLength(2);
    const [first] = found.boxes;
    expect(first!.x).toBeCloseTo(72 / 600);
    expect(first!.width).toBeCloseTo(200 / 600);
    // baseline 600 on an 800-high page: the box sits just above y = 200 from the top
    expect(first!.y).toBeGreaterThan((800 - 600 - 12) / 800 - 0.01);
    expect(first!.y + first!.height).toBeLessThan((800 - 600 + 6) / 800);
    for (const b of found.boxes) {
      for (const v of [b.x, b.y, b.width, b.height, b.x + b.width, b.y + b.height]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it("boxes only the words quoted inside one item", () => {
    const found = locateQuote([page(1, [item("0123456789", 100, 500, 100)])], "34567")!;
    expect(found.boxes).toHaveLength(1);
    expect(found.boxes[0]!.x).toBeCloseTo((100 + 30) / 600);
    expect(found.boxes[0]!.width).toBeCloseTo(50 / 600);
  });

  it("tries the hinted page first when a quote occurs twice", () => {
    const twice = [page(1, [item("Clause abusive.", 72, 700, 90)]), page(3, [item("Clause abusive.", 72, 700, 90)])];
    expect(locateQuote(twice, "Clause abusive.", 3)!.page).toBe(3);
    expect(locateQuote(twice, "Clause abusive.")!.page).toBe(1);
  });

  it("places a quote that the layout cut by its opening words, and says so", () => {
    const opening = "Le locateur peut augmenter le loyer a tout moment";
    const found = locateQuote(pages, `${opening} sans preavis ni justification quelconque dans l'avis`)!;
    expect(found).toMatchObject({ page: 2, match: "start" });
    expect(found.boxes.length).toBeGreaterThan(0);
  });

  it("falls back to the hinted page with no boxes, and to null without a hint — never a guess", () => {
    expect(locateQuote(pages, "Une phrase absente du document", 2)).toEqual({ page: 2, boxes: [], match: "page" });
    expect(locateQuote(pages, "Une phrase absente du document")).toBeNull();
    expect(locateQuote(pages, "absente", 9)).toBeNull();
    expect(locateQuote(pages, "")).toBeNull();
  });

  it("finds nothing on a page with no text layer (a scan)", () => {
    expect(locateQuote([page(1, [])], "Le locateur", undefined)).toBeNull();
  });
});

describe("locateQuote on a real PDF read by pdf.js", () => {
  it("maps quotes of the fixture lease to boxes where the text really is", async () => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const task = pdfjs.getDocument({ data: samplePdf(), useSystemFonts: true, verbosity: 0 });
    const doc = await task.promise;
    const p = await doc.getPage(1);
    const vp = p.getViewport({ scale: 1 });
    const content = await p.getTextContent();
    const text: PageText = { page: 1, width: vp.width, height: vp.height, items: content.items.filter((i): i is typeof i & TextItem => "str" in i) as TextItem[] };
    expect(text.items.length).toBeGreaterThan(0);

    const rent = locateQuote([text], "Le locateur peut augmenter le loyer à tout moment.")!;
    expect(rent).toMatchObject({ page: 1, match: "exact" });
    expect(rent.boxes).toHaveLength(1);
    // the line is at baseline 670 on a 792-high page: 72 left, a little above (792 − 670) / 792 from the top
    expect(rent.boxes[0]!.x).toBeCloseTo(72 / 612, 2);
    expect(rent.boxes[0]!.y).toBeCloseTo((792 - 670 - 11 * 0.9) / 792, 2);

    const deposit = locateQuote([text], "Le dépôt de garantie est de deux mois de loyer.")!;
    expect(deposit.boxes[0]!.y).toBeGreaterThan(rent.boxes[0]!.y); // lower on the page
    expect(locateQuote([text], "Le locateur peut résilier sans motif")).toBeNull();
    await task.destroy();
  });
});
