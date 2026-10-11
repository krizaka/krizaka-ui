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
});
