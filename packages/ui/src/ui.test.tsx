import { render } from "@testing-library/react";

import { cx, KrizakaLogo, OrazakaLogo, OrochiaLogo, ProductLogo, RotatingWord } from "./index";

describe("marks", () => {
  it.each([
    ["Krizaka", KrizakaLogo],
    ["Orazaka", OrazakaLogo],
    ["Orochia", OrochiaLogo],
  ])("%s is decorative by default and named with a title", (name, Mark) => {
    const { container, rerender } = render(<Mark />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<Mark title={name} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe(name);
    expect(container.querySelector("svg")?.getAttribute("role")).toBe("img");
  });

  it("gives every instance its own gradient ids", () => {
    const { container } = render(
      <>
        <KrizakaLogo />
        <KrizakaLogo />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient, radialGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stops moving with animated={false}", () => {
    const { container } = render(<OrochiaLogo animated={false} />);
    expect(container.querySelector(".orom-spin, .orom-slither, .orom-pulse")).toBeNull();
  });

  it("crops the Orochia mark at small sizes", () => {
    const { container } = render(<OrochiaLogo size={24} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("86 82 228 228");
  });

  it("picks a mark by id", () => {
    const { container } = render(<ProductLogo id="orazaka" title="Orazaka" />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("-66 -66 132 132");
  });
});

describe("motion", () => {
  it("shows the first word and hides the roll from assistive tech", () => {
    window.matchMedia = ((q: string) => ({ matches: false, media: q })) as unknown as typeof window.matchMedia;
    const { container } = render(<RotatingWord words={["love", "follow"]} />);
    expect(container.textContent).toBe("love");
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("joins class names", () => {
    expect(cx("a", false, null, "b", undefined)).toBe("a b");
  });
});
