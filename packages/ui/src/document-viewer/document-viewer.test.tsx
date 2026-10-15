import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { DocumentViewer, type PdfjsModule } from "./index";

const items = [
  { str: "Le locateur peut augmenter le loyer a tout moment.", transform: [11, 0, 0, 11, 72, 670], width: 300, height: 11 },
  { str: "Le depot de garantie est de deux mois de loyer.", transform: [11, 0, 0, 11, 72, 650], width: 280, height: 11 },
];
const page = (rotate = 0) => ({
  rotate,
  view: [0, 0, 612, 792],
  getViewport: ({ scale }: { scale: number }) => ({ width: 612 * scale, height: 792 * scale }),
  getTextContent: async () => ({ items }),
  render: () => ({ promise: Promise.resolve() }),
});
const fakePdfjs = (rotate = 0): PdfjsModule => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: () => ({ promise: Promise.resolve({ numPages: 2, getPage: async () => page(rotate) }), destroy: () => undefined }),
});

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = (() => ({})) as never;
  Element.prototype.scrollIntoView = vi.fn();
});

describe("DocumentViewer", () => {
  it("draws the pages and lights the passages where the text layer places them, with no axe violation", async () => {
    const onLocate = vi.fn();
    const { container } = render(
      <DocumentViewer src="/lease.pdf" loadPdfjs={async () => fakePdfjs()} workerSrc="/w.mjs" highlights={[{ id: "r1", quote: "Le locateur peut augmenter le loyer à tout moment." }]} onLocate={onLocate} />,
    );
    await waitFor(() => expect(container.querySelectorAll("[data-page]")).toHaveLength(2));
    expect(screen.getByRole("region", { name: "Document pages" })).toBeTruthy();
    await waitFor(() => expect(container.querySelectorAll('[data-highlight="r1"]').length).toBeGreaterThan(0));
    expect(onLocate.mock.calls.at(-1)![0].r1).toMatchObject({ page: 1, match: "exact" });
    expect(await axeViolations(container)).toEqual([]);
  });

  it("scrolls to the active passage and reports a click on a box", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    const { container, rerender } = render(
      <DocumentViewer src="/lease.pdf" loadPdfjs={async () => fakePdfjs()} workerSrc="/w.mjs" highlights={[{ id: "r2", quote: "Le depot de garantie est de deux mois de loyer." }]} onActiveChange={onActiveChange} />,
    );
    await waitFor(() => expect(container.querySelector('[data-highlight="r2"]')).not.toBeNull());
    rerender(<DocumentViewer src="/lease.pdf" loadPdfjs={async () => fakePdfjs()} workerSrc="/w.mjs" highlights={[{ id: "r2", quote: "Le depot de garantie est de deux mois de loyer." }]} activeId="r2" onActiveChange={onActiveChange} />);
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
    expect(container.querySelector('[data-highlight="r2"]')!.getAttribute("data-active")).toBe("true");
    await user.click(container.querySelector('[data-highlight="r2"]')!);
    expect(onActiveChange).toHaveBeenCalledWith(null);
  });

  it("falls back to the page and the quote when the text layer cannot place a passage", async () => {
    const quote = "Une clause que le texte du PDF ne contient pas";
    const { container } = render(
      <DocumentViewer src="/lease.pdf" loadPdfjs={async () => fakePdfjs()} workerSrc="/w.mjs" highlights={[{ id: "x", quote, page: 2 }, { id: "y", quote }]} activeId="x" />,
    );
    await waitFor(() => expect(screen.getByTestId("document-viewer-bar").textContent).toContain("Passage on page 2:"));
    expect(screen.getByTestId("document-viewer-bar").textContent).toContain(quote);
    expect(container.querySelector("[data-highlight]")).toBeNull();
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  });

  it("says when the quote is nowhere and no page is known; and when the document cannot be opened", async () => {
    const { rerender } = render(<DocumentViewer src="/a.pdf" loadPdfjs={async () => fakePdfjs()} workerSrc="/w.mjs" highlights={[{ id: "y", quote: "absent absent absent" }]} activeId="y" />);
    await waitFor(() => expect(screen.getByTestId("document-viewer-bar").textContent).toContain("not in the document's text layer"));
    await act(async () => rerender(<DocumentViewer src="/b.pdf" loadPdfjs={async () => Promise.reject(new Error("boom"))} workerSrc="/w.mjs" />));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("could not be displayed"));
  });

  it("never draws boxes on a rotated page", async () => {
    const { container } = render(<DocumentViewer src="/lease.pdf" loadPdfjs={async () => fakePdfjs(90)} workerSrc="/w.mjs" highlights={[{ id: "r1", quote: "Le locateur peut augmenter", page: 1 }]} activeId="r1" />);
    await waitFor(() => expect(screen.getByTestId("document-viewer-bar").textContent).toContain("Passage on page 1:"));
    expect(container.querySelector("[data-highlight]")).toBeNull();
  });
});
