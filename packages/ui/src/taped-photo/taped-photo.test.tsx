import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { TapedPhoto } from "./index";

describe("TapedPhoto", () => {
  it("is a figure holding its picture, its caption real text, tilted by a custom property, with no axe violation", async () => {
    const { container } = render(
      <TapedPhoto caption="The flock on the valley">
        <img src="/flock.jpg" alt="Five birds on a valley at dawn" width={1200} height={400} />
      </TapedPhoto>,
    );
    const figure = container.querySelector("figure.kz-taped") as HTMLElement;
    expect(figure.querySelector(".kz-taped-picture img")).toBeTruthy();
    expect(figure.querySelector("figcaption")?.textContent).toBe("The flock on the valley");
    expect(figure.style.getPropertyValue("--kz-taped-tilt")).toBe("-1.6deg");
    expect(figure.dataset.tape).toBeUndefined();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("takes its tilt and its tape, and has no caption when none is given", () => {
    const { container } = render(
      <TapedPhoto tilt={2} tape="top">
        <div>scene</div>
      </TapedPhoto>,
    );
    const figure = container.querySelector("figure") as HTMLElement;
    expect(figure.style.getPropertyValue("--kz-taped-tilt")).toBe("2deg");
    expect(figure.dataset.tape).toBe("top");
    expect(figure.querySelector("figcaption")).toBeNull();
  });
});
