import { fireEvent, render } from "@testing-library/react";

import { PointerLight } from "./index";

describe("PointerLight", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it("writes the pointer's position into the card it is over", () => {
    window.matchMedia = ((query: string) => ({ matches: true, media: query })) as typeof window.matchMedia;
    const { container } = render(
      <div>
        <div data-kz-light="" data-testid="card">
          <span>inside</span>
        </div>
        <PointerLight />
      </div>,
    );
    const card = container.querySelector("[data-kz-light]") as HTMLElement;
    fireEvent.pointerMove(card.firstElementChild as Element, { clientX: 30, clientY: 12 });
    expect(card.style.getPropertyValue("--kz-pointer-x")).toMatch(/px$/);
    expect(container.querySelector("span[hidden]")).toBeTruthy();
  });

  it("does nothing under reduced motion or on a touch screen", () => {
    window.matchMedia = ((query: string) => ({ matches: false, media: query })) as typeof window.matchMedia;
    const { container } = render(
      <div>
        <div data-kz-light="" />
        <PointerLight />
      </div>,
    );
    const card = container.querySelector("[data-kz-light]") as HTMLElement;
    fireEvent.pointerMove(card, { clientX: 30, clientY: 12 });
    expect(card.style.getPropertyValue("--kz-pointer-x")).toBe("");
  });
});
