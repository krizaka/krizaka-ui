import { render, screen, within } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../button/button";
import { axeViolations } from "../test/axe";
import { BookingSection } from "./booking";
import { SECTION_DEFINITIONS } from "./catalogue";
import { demoPets, demoSalon, type DemoShop } from "./demo";
import { GallerySection } from "./gallery";
import { HeroSection } from "./hero";
import { ServicesSection } from "./services";

const noMotion = () =>
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }),
  });
noMotion();

/** Every type × variant the catalogue draws, with the demo data of a shop. */
const renderers: Record<string, Record<string, (shop: DemoShop) => React.ReactElement>> = {
  hero: Object.fromEntries(
    (["poster", "split", "banner", "tv"] as const).map((variant) => [
      variant,
      (shop: DemoShop) => (
        <HeroSection
          variant={variant}
          title={shop.name}
          eyebrow={shop.eyebrow}
          lead={shop.promise}
          cover={shop.cover}
          actions={<Button variant="primary">Book</Button>}
          tv={{ src: "/clip.mp4", poster: shop.cover.src, title: "Latest video" } as never}
        />
      ),
    ]),
  ),
  services: Object.fromEntries(
    (["menu", "cards", "index", "carousel"] as const).map((variant) => [
      variant,
      (shop: DemoShop) => <ServicesSection variant={variant} title="Services" services={shop.services} chooseLabel="Choose" popularLabel="Popular" listLabel="Services" />,
    ]),
  ),
  booking: Object.fromEntries(
    (["strip", "panel", "sticky"] as const).map((variant) => [
      variant,
      (shop: DemoShop) => <BookingSection variant={variant} label="Next free times" times={shop.times} href="#book" actionLabel="Book" title="Ready when you are" body="A few taps." />,
    ]),
  ),
  gallery: Object.fromEntries(
    (["mosaic", "filmstrip", "wall", "grid"] as const).map((variant) => [
      variant,
      (shop: DemoShop) => <GallerySection variant={variant} title="Photos" label="Photos of the shop" photos={shop.photos} sign={shop.name} />,
    ]),
  ),
};

const cases = Object.entries(renderers).flatMap(([type, variants]) => Object.keys(variants).map((variant) => ({ type, variant })));

describe("the shop catalogue (U1)", () => {
  it("draws every variant of the four first types, and no variant the schema does not know", () => {
    for (const type of Object.keys(renderers)) {
      const def = SECTION_DEFINITIONS.find((d) => d.type === type)!;
      expect(Object.keys(renderers[type]!), type).toEqual([...def.variants]);
    }
  });

  describe.each(cases)("$type · $variant", ({ type, variant }) => {
    it.each([demoSalon, demoPets])("renders $name with no axe violation", async (shop) => {
      const { container } = render(renderers[type]![variant]!(shop));
      expect(container.firstElementChild).toBeTruthy();
      expect(await axeViolations(container)).toEqual([]);
    });

    it("has an h1 only in the hero", () => {
      const { container } = render(renderers[type]![variant]!(demoSalon));
      expect(container.querySelectorAll("h1").length).toBe(type === "hero" ? 1 : 0);
    });

    it("draws every image in a box of a fixed ratio (CLS 0), once", () => {
      const { container } = render(renderers[type]![variant]!(demoSalon));
      const imgs = [...container.querySelectorAll("img")];
      for (const img of imgs) {
        // a ratio box of this family, the cover hero's own box, a cabinet, a polaroid print or a gallery tile
        const boxed = img.closest("[data-ratio], [data-cover], .kz-rtv, .kz-polaroid, li, figure, [class*='aspect-']");
        expect(boxed, img.getAttribute("src") ?? "").toBeTruthy();
      }
      const srcs = imgs.map((i) => i.getAttribute("src"));
      expect(new Set(srcs).size, "a photo twice on one section").toBe(srcs.length);
    });
  });
});

describe("services · menu", () => {
  it("is a real list, grouped by category under a note, with the price as text", () => {
    render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" />);
    const groups = screen.getAllByRole("list");
    expect(groups.map((g) => g.getAttribute("aria-labelledby") !== null)).toEqual([true, true, true]);
    expect(screen.getByText("cuts")).toBeTruthy();
    expect(screen.getByText("$45")).toBeTruthy();
    expect(screen.getAllByRole("listitem").length).toBe(5);
  });

  it("names the service in each button, so « Choose » is never ambiguous", () => {
    render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" />);
    for (const s of demoSalon.services) {
      const link = screen.getByRole("link", { name: `Choose ${s.name}` });
      expect(link.textContent).toBe("Choose");
      expect(link.getAttribute("href")).toBe(s.href);
    }
  });

  it("draws a thumbnail only for a service that has its own photo", () => {
    render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" />);
    const rows = screen.getAllByRole("listitem");
    const withPhoto = demoSalon.services.map((s) => Boolean(s.photo));
    expect(rows.map((r) => r.querySelector("img") !== null)).toEqual(withPhoto);
    expect(withPhoto).toContain(false);
    // the thumbnail is the service's own photo, in a 1:1 box
    const chair = within(rows[1]!).getByRole("img");
    expect(chair.getAttribute("src")).toBe(demoSalon.services[1]!.photo!.src);
    expect(chair.closest("[data-ratio]")!.getAttribute("data-ratio")).toBe("1/1");
  });

  it("marks « Popular » only where the data says so, and « from » before a varying price", () => {
    render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" />);
    // drawn twice (beside the name from `sm`, in the line below on a phone): one of the two is `display: none` at any width
    expect(screen.getAllByText("Popular").length).toBe(2);
    expect(screen.getAllByText("from").length).toBe(2);
  });

  it("puts the aside beside the list, and two columns only when nothing is beside it", () => {
    const { container, rerender } = render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" aside={<p>Open now</p>} columns={2} />);
    expect(container.querySelector("aside")?.textContent).toBe("Open now");
    expect(container.querySelector(".lg\\:grid-cols-2")).toBeNull();
    rerender(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" columns={2} />);
    expect(container.querySelector(".lg\\:grid-cols-2")).toBeTruthy();
  });

  it("does not group when asked not to", () => {
    render(<ServicesSection title="Services" services={demoSalon.services} chooseLabel="Choose" popularLabel="Popular" groupBy="none" listLabel="All services" />);
    expect(screen.getAllByRole("list").length).toBe(1);
    expect(screen.getByRole("list", { name: "All services" })).toBeTruthy();
  });
});

describe("services · cards", () => {
  it("draws six cards at most", () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ ...demoSalon.services[0]!, id: `s${i}`, name: `Service ${i}` }));
    render(<ServicesSection variant="cards" title="Services" services={many} chooseLabel="Choose" popularLabel="Popular" />);
    expect(screen.getAllByRole("article").length).toBe(6);
  });
});

describe("gallery", () => {
  it("shows fewer tiles when it runs out of photos, never a repeat", () => {
    const { container } = render(<GallerySection variant="mosaic" title="Photos" label="Photos" photos={demoSalon.photos.slice(0, 3)} />);
    expect(container.querySelectorAll("img").length).toBe(3);
  });

  it("holds twelve photos at most", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ id: `p${i}`, photo: { src: `/p${i}.jpg`, alt: `p${i}` } }));
    const { container } = render(<GallerySection variant="filmstrip" title="Photos" label="Photos" photos={many} />);
    expect(container.querySelectorAll("img").length).toBe(12);
  });

  it("hangs the wall the same way every time (no random: no hydration mismatch)", async () => {
    const { wallLayout } = await import("./gallery");
    expect(wallLayout(7)).toEqual(wallLayout(7));
    for (const p of wallLayout(11)) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
    }
  });
});

describe("booking", () => {
  it("lists the next free times as links, and says so when there are none", () => {
    const { rerender } = render(<BookingSection label="Next free times" times={demoSalon.times} href="#book" actionLabel="All times" />);
    expect(screen.getAllByRole("link").length).toBe(5);
    rerender(<BookingSection label="Next free times" times={[]} emptyLabel="Nothing free this week" href="#book" actionLabel="All times" />);
    expect(screen.getByText("Nothing free this week")).toBeTruthy();
  });
});

describe("hero", () => {
  it("keeps the name as the h1 and the first image at high priority in a fixed box", () => {
    for (const variant of ["poster", "split", "banner"] as const) {
      const { container, unmount } = render(<HeroSection variant={variant} title="Salon" cover={demoSalon.cover} />);
      expect(screen.getByRole("heading", { level: 1, name: "Salon" })).toBeTruthy();
      expect(container.querySelector("img")!.getAttribute("fetchpriority")).toBe("high");
      expect(container.querySelector("img")!.getAttribute("loading")).toBeNull();
      unmount();
    }
  });
});
