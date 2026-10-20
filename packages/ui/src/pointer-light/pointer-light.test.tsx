import { fireEvent, render } from "@testing-library/react";

import { PointerLight } from "./index";

describe("PointerLight (deprecated no-op since krizaka-ui#393)", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it("renders a hidden span and writes nothing, even on a fine pointer without reduced motion", () => {
    window.matchMedia = ((query: string) => ({ matches: true, media: query })) as typeof window.matchMedia;
    const { container } = render(
      <div>
        <div data-kz-light="">
          <span>inside</span>
        </div>
        <PointerLight />
      </div>,
    );
    const card = container.querySelector("[data-kz-light]") as HTMLElement;
    fireEvent.pointerMove(card.firstElementChild as Element, { clientX: 30, clientY: 12 });
    expect(card.style.getPropertyValue("--kz-pointer-x")).toBe("");
    expect(container.querySelector("span[hidden]")).toBeTruthy();
  });
});
