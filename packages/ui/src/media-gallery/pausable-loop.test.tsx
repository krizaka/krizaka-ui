import { render } from "@testing-library/react";

import { focusStyle, PausableLoop } from "./loop-index";

describe("PausableLoop focus", () => {
  it("frames the excerpt it enlarges on a phone: its centre and zoom as CSS variables", () => {
    const { container } = render(<PausableLoop sources={{ mp4: "/a.mp4" }} poster="/a.jpg" focus={{ x: 0.25, y: 0.5, zoom: 2 }} />);
    const frame = container.querySelector<HTMLElement>("[data-focus]");
    expect(frame?.style.getPropertyValue("--kz-loop-x")).toBe("25%");
    expect(frame?.style.getPropertyValue("--kz-loop-y")).toBe("50%");
    expect(frame?.style.getPropertyValue("--kz-loop-zoom")).toBe("2");
  });

  it("keeps the excerpt inside the frame and the zoom between 1 and 4", () => {
    expect(focusStyle({ x: -1, y: 3, zoom: 9 })).toEqual({ "--kz-loop-x": "0%", "--kz-loop-y": "100%", "--kz-loop-zoom": "4" });
    expect(focusStyle({ x: Number.NaN, y: 0.5, zoom: 0 })).toMatchObject({ "--kz-loop-x": "0%", "--kz-loop-zoom": "1" });
  });

  it("draws no focus frame without a focus", () => {
    const { container } = render(<PausableLoop sources={{ mp4: "/a.mp4" }} poster="/a.jpg" />);
    expect(container.querySelector("[data-focus]")).toBeNull();
  });
});
