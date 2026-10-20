import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { cropRect, ImageCropper } from "./index";

describe("cropRect", () => {
  it("turns a focus point and a zoom into pixels of the source", () => {
    expect(cropRect({ x: 0.5, y: 0.5, zoom: 1 }, { width: 1600, height: 900 }, 1)).toEqual({ x: 350, y: 0, width: 900, height: 900 });
    expect(cropRect({ x: 0, y: 0.5, zoom: 2 }, { width: 1600, height: 900 }, 1)).toEqual({ x: 0, y: 225, width: 450, height: 450 });
  });
});

describe("ImageCropper", () => {
  it("is a focusable, described frame with a zoom slider, with no axe violation", async () => {
    const { container } = render(<ImageCropper src="/a.jpg" alt="" aspect={1} round />);
    const frame = screen.getByRole("group", { name: "Crop area" });
    expect(frame.tabIndex).toBe(0);
    expect(document.getElementById(frame.getAttribute("aria-describedby")!)?.textContent).toContain("arrow keys");
    expect(screen.getByRole("slider", { name: "Zoom" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves with the arrows and zooms with + / −, never leaving a gap", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ImageCropper src="/a.jpg" aspect={1} naturalSize={{ width: 1600, height: 900 }} onValueChange={onValueChange} />);
    screen.getByRole("group").focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange.mock.calls.at(-1)![0].x).toBeCloseTo(0.52);
    await user.keyboard("+");
    expect(onValueChange.mock.calls.at(-1)![0].zoom).toBeCloseTo(1.1);
    await user.keyboard("{ArrowUp}");
    // At zoom 1.1 the height leaves almost no room: y stays close to the centre.
    expect(onValueChange.mock.calls.at(-1)![0].y).toBeGreaterThanOrEqual(0.45);
  });

  it("measures the picture once it loads", () => {
    render(<ImageCropper src="/a.jpg" alt="Cover" aspect={3} />);
    const img = screen.getByRole("img", { name: "Cover" });
    Object.defineProperty(img, "naturalWidth", { value: 1000 });
    Object.defineProperty(img, "naturalHeight", { value: 1000 });
    fireEvent.load(img);
    expect(img.style.width).toBe("100%");
    expect(img.style.height).toBe("300%");
  });

  it.each([
    ["portrait 9:16", { width: 900, height: 1600 }],
    ["landscape 16:9", { width: 1600, height: 900 }],
    ["square", { width: 1000, height: 1000 }],
  ])("always covers the frame at any zoom and focus: %s (#172)", (_name, size) => {
    for (const aspect of [1, 9 / 16, 3]) {
      for (const zoom of [1, 1.5, 4]) {
        for (const focus of [0, 0.5, 1]) {
          const { unmount } = render(
            <ImageCropper src="/a.jpg" alt="p" aspect={aspect} round={aspect === 1} naturalSize={size} value={{ x: focus, y: 1 - focus, zoom }} showZoom={false} />,
          );
          const img = screen.getByRole("img", { name: "p" });
          const [w, h, l, t] = [img.style.width, img.style.height, img.style.left, img.style.top].map(Number.parseFloat);
          expect(l!).toBeLessThanOrEqual(1e-6);
          expect(t!).toBeLessThanOrEqual(1e-6);
          expect(l! + w!).toBeGreaterThanOrEqual(100 - 1e-6);
          expect(t! + h!).toBeGreaterThanOrEqual(100 - 1e-6);
          unmount();
        }
      }
    }
  });

  it("measures a picture that finished loading before React attached (cache hit, SSR): no onLoad ever fires (#172)", () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const w = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(900);
    const h = vi.spyOn(HTMLImageElement.prototype, "naturalHeight", "get").mockReturnValue(1600);
    try {
      render(<ImageCropper src="/portrait.jpg" alt="P" aspect={1} value={{ x: 0.5, y: 0.5, zoom: 2 }} showZoom={false} />);
      const img = screen.getByRole("img", { name: "P" });
      // A 9:16 picture in a square frame at zoom 2: 200 % wide, about 355.6 % high — it covers the frame.
      expect(img.style.width).toBe("200%");
      expect(Number.parseFloat(img.style.height)).toBeCloseTo(355.5556, 3);
    } finally {
      complete.mockRestore();
      w.mockRestore();
      h.mockRestore();
    }
  });
});
