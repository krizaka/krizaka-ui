"use client";

/* Yomizaka on a phone: the DocumentViewer of @krizaka/ui on a one-page lease, its two flagged clauses lit. pdf.js is
   loaded from its CDN build, as in the component's own example; this module is loaded only when Yomizaka is worn. */

import { DocumentViewer } from "@krizaka/ui/document-viewer";
import { useState } from "react";

const PDF = "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAyMDkgPj4Kc3RyZWFtCkJUIC9GMSAxNCBUZiA3MiA3MDAgVGQgKEJBSUwgUkVTSURFTlRJRUwpIFRqIEVUCkJUIC9GMSAxMSBUZiA3MiA2NzAgVGQgKExlIGxvY2F0ZXVyIHBldXQgYXVnbWVudGVyIGxlIGxveWVyIGEgdG91dCBtb21lbnQuKSBUaiBFVApCVCAvRjEgMTEgVGYgNzIgNjUwIFRkIChMZSBkZXBvdCBkZSBnYXJhbnRpZSBlc3QgZGUgZGV1eCBtb2lzIGRlIGxveWVyLikgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDA1MDAgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo1NzAKJSVFT0YK";
const QUOTES = ["Le locateur peut augmenter le loyer à tout moment.", "Le dépôt de garantie est de deux mois de loyer."];
const CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/build/";
const loadPdfjs = () => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${CDN}pdf.min.mjs`) as never;
const bytes = () => Uint8Array.from(atob(PDF), (c) => c.charCodeAt(0));

export function DocumentPhone({ title, highlights }: { title: string; highlights: string[] }) {
  const [active, setActive] = useState<string | null>("q0");
  const [src] = useState(bytes);
  return (
    <div className="kz-scene-doc">
      <strong>{title}</strong>
      <div className="kz-scene-doc-flags" role="group" aria-label={title}>
        {highlights.map((label, i) => (
          <button key={label} type="button" aria-pressed={active === `q${i}`} onClick={() => setActive(`q${i}`)}>
            {label}
          </button>
        ))}
      </div>
      <DocumentViewer
        src={src}
        loadPdfjs={loadPdfjs}
        workerSrc={`${CDN}pdf.worker.min.mjs`}
        highlights={QUOTES.map((quote, i) => ({ id: `q${i}`, quote, label: highlights[i] ?? "" }))}
        activeId={active}
        onActiveChange={setActive}
      />
    </div>
  );
}
