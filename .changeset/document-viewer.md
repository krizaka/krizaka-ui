---
"@krizaka/ui": minor
---

`@krizaka/ui/document-viewer` — `DocumentViewer`: a PDF drawn page by page with pdf.js (an optional peer the app loads with `loadPdfjs={() => import("pdfjs-dist")}`), and the passages of a report lit where they sit. `highlights` are quotes: `locateQuote` (pure, exported) finds them in the PDF's own text positions and gives one box per line in fractions of the page; `activeId` scrolls to a passage, a click on a box calls `onActiveChange`, `onLocate` tells the app what was placed. A passage the text layer cannot place is never drawn at a guessed place: the viewer goes to its page when known and shows the quote in a bar.
