import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { ShopGallery, shopGalleryLabelsFr } from "./index";

const photos = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, src: `/p${i}-400.jpg`, srcSet: `/p${i}-400.jpg 400w, /p${i}-800.jpg 800w`, fullSrc: `/p${i}-1200.jpg`, alt: `Photo ${i + 1}` }));
const gallery = (n: number, props: Partial<React.ComponentProps<typeof ShopGallery>> = {}) => <ShopGallery label="Photos of the salon" photos={photos(n)} {...props} />;

describe("ShopGallery layout", () => {
  it.each([
    [1, undefined, undefined],
    [3, undefined, undefined],
    [4, undefined, undefined],
    [5, "true", undefined],
    [12, "true", "true"],
  ])("with %i photos: strip=%s, more=%s", (n, strip, more) => {
    const { container } = render(gallery(n));
    const root = container.querySelector(".kz-sg")!;
    expect(root.getAttribute("data-count")).toBe(String(n));
    expect(root.getAttribute("data-strip") ?? undefined).toBe(strip);
    expect(root.getAttribute("data-more") ?? undefined).toBe(more);
    expect(container.querySelectorAll(".kz-sg-tile")).toHaveLength(n);
  });

  it("draws the « + N photos » tile on the fifth tile only, and the strip's counter from five photos", () => {
    const { container } = render(gallery(12));
    expect(container.querySelectorAll(".kz-sg-more")).toHaveLength(1);
    expect(container.querySelectorAll(".kz-sg-tile")[4]!.querySelector(".kz-sg-more")?.textContent).toBe("+ 8 photos");
    expect(container.querySelector(".kz-sg-count")?.textContent).toBe("1 / 12");
    expect(render(gallery(4)).container.querySelector(".kz-sg-count")).toBeNull();
  });

  it("keeps fixed ratios and tokens only: no hard-coded colour", () => {
    const { container } = render(gallery(5));
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("aspect-ratio:2/1");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    expect(css).toContain("prefers-reduced-motion:no-preference");
    expect(css).toContain("scrollbar-width:none");
  });

  it("gives each image its srcset and sizes, and names each tile by its photo", () => {
    render(gallery(5));
    const tile = screen.getByRole("button", { name: "Open photo 2 of 5: Photo 2" });
    const img = tile.querySelector("img")!;
    expect(img.getAttribute("srcset")).toContain("800w");
    expect(img.getAttribute("sizes")).toBeTruthy();
    expect(img.getAttribute("alt")).toBe("");
  });

  it("renders nothing without photos and labels in French", () => {
    expect(render(gallery(0)).container.querySelector(".kz-sg")).toBeNull();
    render(gallery(3, { labels: shopGalleryLabelsFr }));
    expect(screen.getByRole("button", { name: "Ouvrir la photo 1 sur 3 : Photo 1" })).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(gallery(12));
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("ShopGallery lightbox", () => {
  it("loads nothing of the lightbox until a photo is opened, then shows it with its caption", async () => {
    render(gallery(12));
    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Open photo 3 of 12/ }));
    const dialog = await screen.findByRole("dialog", { name: "Photos of the salon" });
    expect(dialog.querySelector("img.kz-sg-photo")?.getAttribute("src")).toBe("/p2-1200.jpg");
    expect(dialog.textContent).toContain("Photo 3");
    expect(dialog.textContent).toContain("3 of 12");
  });

  it("moves with the arrow keys (wrapping) and closes with Escape, giving focus back to the tile", async () => {
    render(gallery(5));
    const tile = screen.getByRole("button", { name: /Open photo 1 of 5/ });
    tile.focus();
    await userEvent.click(tile);
    const dialog = await screen.findByRole("dialog");
    await userEvent.keyboard("{ArrowRight}");
    expect(dialog.querySelector("img.kz-sg-photo")?.getAttribute("src")).toBe("/p1-1200.jpg");
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(dialog.querySelector("img.kz-sg-photo")?.getAttribute("src")).toBe("/p4-1200.jpg");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(tile);
  });

  it("traps focus inside the dialog", async () => {
    render(gallery(5));
    await userEvent.click(screen.getByRole("button", { name: /Open photo 1 of 5/ }));
    const dialog = await screen.findByRole("dialog");
    for (let i = 0; i < 6; i++) await userEvent.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("moves with the previous and next buttons", async () => {
    render(gallery(5));
    await userEvent.click(screen.getByRole("button", { name: /Open photo 1 of 5/ }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(dialog.querySelector("img.kz-sg-photo")?.getAttribute("src")).toBe("/p1-1200.jpg");
    await userEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(dialog.querySelector("img.kz-sg-photo")?.getAttribute("src")).toBe("/p0-1200.jpg");
  });

  it("swipes: left for the next photo, right for the previous, a short drag does nothing", async () => {
    render(gallery(5));
    await userEvent.click(screen.getByRole("button", { name: /Open photo 2 of 5/ }));
    const dialog = await screen.findByRole("dialog");
    const stage = dialog.querySelector(".kz-sg-stage")!;
    const swipe = (from: number, to: number) => {
      act(() => {
        fireEvent.touchStart(stage, { touches: [{ clientX: from }], changedTouches: [{ clientX: from }] });
        fireEvent.touchEnd(stage, { touches: [], changedTouches: [{ clientX: to }] });
      });
    };
    const src = () => dialog.querySelector("img.kz-sg-photo")?.getAttribute("src");
    swipe(300, 100);
    expect(src()).toBe("/p2-1200.jpg");
    swipe(100, 300);
    expect(src()).toBe("/p1-1200.jpg");
    swipe(100, 120);
    expect(src()).toBe("/p1-1200.jpg");
  });

  it("has no axe violations while open", async () => {
    render(gallery(5));
    await userEvent.click(screen.getByRole("button", { name: /Open photo 1 of 5/ }));
    const dialog = await screen.findByRole("dialog");
    expect(await axeViolations(dialog)).toEqual([]);
  });
});
