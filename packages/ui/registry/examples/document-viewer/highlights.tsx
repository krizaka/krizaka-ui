"use client";

import { DocumentViewer } from "@krizaka/ui/document-viewer";
import * as React from "react";

const PDF = "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAyMDkgPj4Kc3RyZWFtCkJUIC9GMSAxNCBUZiA3MiA3MDAgVGQgKEJBSUwgUkVTSURFTlRJRUwpIFRqIEVUCkJUIC9GMSAxMSBUZiA3MiA2NzAgVGQgKExlIGxvY2F0ZXVyIHBldXQgYXVnbWVudGVyIGxlIGxveWVyIGEgdG91dCBtb21lbnQuKSBUaiBFVApCVCAvRjEgMTEgVGYgNzIgNjUwIFRkIChMZSBkZXBvdCBkZSBnYXJhbnRpZSBlc3QgZGUgZGV1eCBtb2lzIGRlIGxveWVyLikgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDA1MDAgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo1NzAKJSVFT0YK";
// Two passages told by their quote, and one told by a region of the page (fractions, origin top-left): an app that already
// knows where a stamp or a mismatch sits lights it without any text to match.
const quotes = [
  { id: "r1", quote: "Le locateur peut augmenter le loyer à tout moment.", label: "Rent increase" },
  { id: "r2", quote: "Le dépôt de garantie est de deux mois de loyer.", label: "Deposit" },
  { id: "r3", region: { page: 1, x: 0.1, y: 0.1, width: 0.3, height: 0.05 }, label: "Title block" },
];
// pdf.js is the app's: `loadPdfjs={() => import("pdfjs-dist")}` and a worker served from its own origin. Here, from a CDN.
const CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/build/";
const loadPdfjs = () => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${CDN}pdf.min.mjs`) as never;

// Pick a passage in your own list: the viewer scrolls to it and lights it where it sits in the page.
export default function DocumentViewerHighlights() {
  const [active, setActive] = React.useState<string | null>("r1");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {quotes.map((q) => (
          <button key={q.id} type="button" aria-pressed={active === q.id} className="rounded-md border border-border-default px-3 py-1 text-sm aria-pressed:bg-surface-3" onClick={() => setActive(q.id)}>
            {q.label}
          </button>
        ))}
      </div>
      <DocumentViewer src={Uint8Array.from(atob(PDF), (c) => c.charCodeAt(0))} loadPdfjs={loadPdfjs} workerSrc={`${CDN}pdf.worker.min.mjs`} highlights={quotes} activeId={active} onActiveChange={setActive} />
    </div>
  );
}
