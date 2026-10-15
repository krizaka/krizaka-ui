/** @krizaka/ui/document-viewer — `DocumentViewer` (a PDF drawn by pdf.js, its passages lit where they sit), `locateQuote` (a quote → boxes, pure). Client ("use client"). */
export { type DocumentHighlight, DocumentViewer, documentViewer, type DocumentViewerLabels, documentViewerLabels, type DocumentViewerProps, type Located, type PdfDocument, type PdfjsModule, type PdfPage } from "./document-viewer";
export { type Box, fold, locateQuote, type PageText, type TextItem } from "./locate";
