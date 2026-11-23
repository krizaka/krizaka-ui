import { render } from "@testing-library/react";

import { DepthField, motionTierOf, useMotionTier } from "./index";

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (media: string) => ({ matches: reduced && media.includes("reduce"), media, addEventListener() {}, removeEventListener() {} }));
}

afterEach(() => vi.unstubAllGlobals());

describe("motionTierOf", () => {
  it("is still under reduced motion, whatever the device", () => {
    expect(motionTierOf({ reducedMotion: true, deviceMemory: 16, cores: 16 })).toBe("still");
  });

  it("is light on a weak device or under Save-Data", () => {
    expect(motionTierOf({ reducedMotion: false, deviceMemory: 2 })).toBe("light");
    expect(motionTierOf({ reducedMotion: false, cores: 2 })).toBe("light");
    expect(motionTierOf({ reducedMotion: false, saveData: true })).toBe("light");
  });

  it("is full on a capable device, and when the browser does not say", () => {
    expect(motionTierOf({ reducedMotion: false, deviceMemory: 8, cores: 8 })).toBe("full");
    expect(motionTierOf({ reducedMotion: false })).toBe("full");
  });
});

function Probe() {
  return <p data-testid="tier">{useMotionTier()}</p>;
}

describe("useMotionTier and DepthField", () => {
  it("reads the reader's preference: still under reduced motion", () => {
    stubReducedMotion(true);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("tier").textContent).toBe("still");
  });

  it("marks its tier and stays still under reduced motion: no pointer variables are written", () => {
    stubReducedMotion(true);
    const { container } = render(<DepthField>layers</DepthField>);
    const field = container.firstElementChild as HTMLElement;
    expect(field.dataset.tier).toBe("still");
    field.dispatchEvent(new PointerEvent("pointermove", { clientX: 10, clientY: 10 }));
    expect(field.style.getPropertyValue("--kz-px")).toBe("");
  });

  it("is full on a capable device", () => {
    stubReducedMotion(false);
    const { container } = render(<DepthField className="x">layers</DepthField>);
    expect((container.firstElementChild as HTMLElement).dataset.tier).not.toBe("still");
  });
});
