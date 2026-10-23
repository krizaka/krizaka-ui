import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DropOverlay } from "./drop-overlay";
import { dragHasFiles, splitDropped } from "./files";

const pdf = { name: "bail.PDF", type: "application/pdf" };
const png = { name: "photo.png", type: "image/png" };
const txt = { name: "notes.txt", type: "" };

describe("files: what a drag carries and what a product accepts", () => {
  it("raises only for a drag of files", () => {
    expect(dragHasFiles({ types: ["Files"] })).toBe(true);
    expect(dragHasFiles({ types: ["text/plain"] })).toBe(false);
    expect(dragHasFiles(null)).toBe(false);
  });

  it.each([
    [undefined, [pdf, png, txt], []],
    [["application/pdf"], [pdf], [png, txt]],
    [[".pdf", ".txt"], [pdf, txt], [png]],
    [["image/*"], [png], [pdf, txt]],
  ])("accept %j", (accept, accepted, rejected) => {
    expect(splitDropped([pdf, png, txt], accept)).toEqual({ accepted, rejected });
  });
});

const drag = (type: string, files = true) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, { dataTransfer: { types: files ? ["Files"] : ["text/plain"], files: [pdf] } });
  return event;
};

describe("DropOverlay", () => {
  it("covers the window while files are dragged over it, and hands the dropped files over", () => {
    const onFiles = vi.fn();
    render(<DropOverlay label="Déposez pour vérifier" onFiles={onFiles} />);
    expect(screen.queryByText("Déposez pour vérifier")).toBeNull();
    act(() => void window.dispatchEvent(drag("dragenter")));
    expect(screen.getByText("Déposez pour vérifier")).toBeTruthy();
    act(() => void window.dispatchEvent(drag("drop")));
    expect(onFiles).toHaveBeenCalledWith([pdf], []);
    expect(screen.queryByText("Déposez pour vérifier")).toBeNull();
  });

  it("stays away from a drag of text, and after the pointer leaves the window", () => {
    render(<DropOverlay label="Déposez" onFiles={() => {}} />);
    act(() => void window.dispatchEvent(drag("dragenter", false)));
    expect(screen.queryByText("Déposez")).toBeNull();
    act(() => void window.dispatchEvent(drag("dragenter")));
    act(() => void window.dispatchEvent(drag("dragleave")));
    expect(screen.queryByText("Déposez")).toBeNull();
  });

  it("is inert when disabled", () => {
    render(<DropOverlay label="Déposez" onFiles={() => {}} disabled />);
    act(() => void window.dispatchEvent(drag("dragenter")));
    expect(screen.queryByText("Déposez")).toBeNull();
  });

  it("splits by accept: the accepted first, the rejected second", () => {
    const onFiles = vi.fn();
    render(<DropOverlay label="Déposez" accept={[".pdf"]} onFiles={onFiles} />);
    const event = drag("drop");
    Object.assign(event, { dataTransfer: { types: ["Files"], files: [pdf, png] } });
    act(() => void window.dispatchEvent(drag("dragenter")));
    act(() => void window.dispatchEvent(event));
    expect(onFiles).toHaveBeenCalledWith([pdf], [png]);
  });
});

describe("DropOverlay, controlled", () => {
  it("shows while `active` is true and ignores the DOM drag events", () => {
    const { rerender } = render(<DropOverlay label="Déposez" active={false} />);
    act(() => void window.dispatchEvent(drag("dragenter")));
    expect(screen.queryByText("Déposez")).toBeNull();
    rerender(<DropOverlay label="Déposez" active />);
    expect(screen.getByText("Déposez")).toBeTruthy();
    rerender(<DropOverlay label="Déposez" active disabled />);
    expect(screen.queryByText("Déposez")).toBeNull();
  });
});
