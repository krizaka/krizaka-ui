import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { StickyAction } from "./index";

describe("StickyAction", () => {
  it("holds its action at the bottom edge of a phone and is not drawn from md up", async () => {
    const { container } = render(
      <StickyAction data-testid="bar">
        <a href="#book">Book</a>
      </StickyAction>,
    );
    const cls = screen.getByTestId("bar").className;
    expect(cls).toContain("sticky");
    expect(cls).toContain("bottom-0");
    expect(cls).toContain("md:hidden");
    expect(cls).toContain("safe-area-inset-bottom");
    expect(screen.getByRole("link", { name: "Book" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("StickyAction task mode", () => {
  it("stays on every width and reads the total before the action", async () => {
    const { container } = render(
      <StickyAction mode="task" summary="Total $640" data-testid="bar">
        <button type="button">Send</button>
      </StickyAction>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar.className).not.toContain("md:hidden");
    expect(bar.className).toContain("sticky");
    const text = bar.textContent ?? "";
    expect(text.indexOf("Total $640")).toBeLessThan(text.indexOf("Send"));
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("StickyAction hideWhileVisible (krizaka-ui#608)", () => {
  let observed: Element | undefined;
  let report: IntersectionObserverCallback;
  const disconnect = vi.fn();
  let reduced = false;
  beforeEach(() => {
    observed = undefined;
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(cb: IntersectionObserverCallback) { report = cb; }
      observe = (el: Element) => { observed = el; };
      disconnect = disconnect;
    });
  });
  afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; reduced = false; vi.clearAllMocks(); });

  const page = (props: { hideWhileVisible?: string } = {}) => render(
    <main>
      <a id="hero-book" href="#book">Book</a>
      <StickyAction data-testid="bar" {...props}><a href="#book2">Book now</a></StickyAction>
    </main>,
    { container: document.body.appendChild(document.createElement("div")) },
  );

  it("hides the bar while the page's own action is on screen, and shows it when it leaves", () => {
    page({ hideWhileVisible: "#hero-book" });
    const bar = screen.getByTestId("bar");
    expect(observed?.id).toBe("hero-book");
    expect(bar.hasAttribute("data-hidden")).toBe(false);
    act(() => report([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(bar.hasAttribute("data-hidden")).toBe(true);
    act(() => report([{ isIntersecting: false }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(bar.hasAttribute("data-hidden")).toBe(false);
  });

  it("when hidden, takes no space away (no layout shift), cannot be focused or read, and cannot be pressed", () => {
    page({ hideWhileVisible: "#hero-book" });
    const bar = screen.getByTestId("bar");
    act(() => report([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(bar.hasAttribute("inert")).toBe(true);
    expect(bar.className).toContain("data-[hidden]:opacity-0");
    expect(bar.className).toContain("data-[hidden]:pointer-events-none");
    expect(bar.className).not.toMatch(/data-\[hidden\]:(hidden|invisible|h-0)/);
  });

  it("slides away, or only fades under reduced motion", () => {
    page({ hideWhileVisible: "#hero-book" });
    const cls = screen.getByTestId("bar").className;
    expect(cls).toContain("data-[hidden]:translate-y-3");
    expect(cls).toContain("motion-reduce:data-[hidden]:translate-y-0");
    expect(cls).toContain("transition-[opacity,translate]");
  });

  it("stays visible without observers, without a target, or without the prop; and disconnects on unmount", () => {
    const { unmount } = page({ hideWhileVisible: "#nowhere" });
    expect(observed).toBeUndefined();
    expect(screen.getByTestId("bar").hasAttribute("data-hidden")).toBe(false);
    unmount();
    vi.stubGlobal("IntersectionObserver", undefined);
    page({ hideWhileVisible: "#hero-book" });
    expect(screen.getAllByTestId("bar").every((bar) => !bar.hasAttribute("data-hidden"))).toBe(true);
    vi.stubGlobal("IntersectionObserver", class { constructor(cb: IntersectionObserverCallback) { report = cb; } observe = vi.fn(); disconnect = disconnect; });
    const again = page({ hideWhileVisible: "#hero-book" });
    again.unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("refuses a selector that is not valid instead of throwing", () => {
    expect(() => page({ hideWhileVisible: "###" })).not.toThrow();
  });
});

