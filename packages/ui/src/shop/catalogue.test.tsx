import { render, screen, within } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import ShopPageExample from "../../registry/examples/shop/page";
import { Button } from "../button/button";
import { axeViolations } from "../test/axe";
import { BookingSection } from "./booking";
import { BulletinSection, liveFlyers } from "./bulletin";
import { SECTION_DEFINITIONS } from "./catalogue";
import { demoPets, demoSalon, type DemoShop } from "./demo";
import { faqJsonLd,FaqSection } from "./faq";
import { GallerySection } from "./gallery";
import { HeroSection } from "./hero";
import { PoliciesSection } from "./policies";
import { ReviewsSection } from "./reviews";
import { ServicesSection } from "./services";
import { SocialSection } from "./social";
import { StorySection } from "./story";
import { TeamSection } from "./team";
import { VideoSection } from "./video";
import { VisitSection } from "./visit";

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
    (["strip", "panel", "closing", "sticky"] as const).map((variant) => [
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

const play = { tiktok: "Load TikTok and play", "youtube-shorts": "Load YouTube and play", instagram: "Load Instagram and play" };
const reel = { id: "r1", platform: "tiktok" as const, url: "https://www.tiktok.com/@salon/video/7123456789012345678", title: "Latest reel" };
const summary = { score: 4.7, count: 38, distribution: [0, 1, 2, 7, 28] as [number, number, number, number, number], scoreText: "4.7 / 5", countText: "38 verified reviews", summaryText: "4.7 out of 5 from 38 reviews", starText: (s: number, n: number) => `${s} stars: ${n}` };
const reviewList = [
  { id: "a", author: "Nadia F.", date: "October 2026", dateTime: "2026-10", service: "Cut and blow-dry", rating: 5, ratingText: "5 out of 5", text: "The best blow-dry in the neighbourhood." },
  { id: "b", author: "Léo P.", date: "October 2026", dateTime: "2026-10", service: "Balayage", rating: 5, ratingText: "5 out of 5", text: "Jade listened, never pushed." },
];
const hoursProps = (shop: DemoShop) => ({ hours: shop.hours, status: shop.status, hoursLabel: "Hours", address: shop.address, phone: { href: "tel:5145550110", label: shop.phone } });
const mapProps = { label: "Where the salon is", center: [-73.58, 45.48] as [number, number], showLabel: "Show the map" };

Object.assign(renderers, {
  video: {
    tv: (shop: DemoShop) => <VideoSection variant="tv" title="Latest" reels={[reel]} playLabels={play} cabinet="portable" channel={`CH 3 · ${shop.eyebrow}`} />,
    shorts: () => <VideoSection variant="shorts" title="Reels" reels={[reel, { ...reel, id: "r2" }]} playLabels={play} />,
  },
  reviews: Object.fromEntries((["summary-cards", "quote", "strip"] as const).map((variant) => [variant, () => <ReviewsSection variant={variant} title="Reviews" summary={summary} reviews={reviewList} />])),
  bulletin: Object.fromEntries((["board", "banner"] as const).map((variant) => [variant, () => <BulletinSection variant={variant} title="News" today="2026-10-27" flyers={[{ id: "f", text: "Closed Monday the 3rd.", signature: "Jade", until: "2026-11-03" }]} />])),
  team: Object.fromEntries((["row", "cards"] as const).map((variant) => [variant, (shop: DemoShop) => <TeamSection variant={variant} title="Team" members={shop.team.map((t) => ({ id: t.id, name: t.name, role: "Stylist" }))} />])),
  visit: Object.fromEntries((["card", "map", "split"] as const).map((variant) => [variant, (shop: DemoShop) => <VisitSection variant={variant} title="Visit" {...hoursProps(shop)} map={mapProps} />])),
  story: Object.fromEntries((["quote", "owner"] as const).map((variant) => [variant, () => <StorySection variant={variant} title="Our story" quote="Cuts that last." body="Three friends opened the salon in 2019." owner={{ name: "Jade" }} />])),
  social: {
    links: () => <SocialSection variant="links" title="Follow us" links={[{ id: "a", platform: "instagram", url: "https://instagram.com/salon" }]} />,
    facade: () => <SocialSection variant="facade" title="Follow us" links={[{ id: "a", platform: "tiktok", url: reel.url }]} playLabels={play} />,
  },
  faq: { list: () => <FaqSection title="Questions" questions={[{ id: "q", question: "Do I need to book?", answer: "Yes." }]} /> },
  policies: { inline: () => <PoliciesSection title="Policies" items={[{ id: "p", term: "Cancellation", details: "Free up to 24 h before" }]} /> },
});

const cases = Object.entries(renderers).flatMap(([type, variants]) => Object.keys(variants).map((variant) => ({ type, variant })));

describe("the shop catalogue", () => {
  it("draws every variant of every type, and no variant the schema does not know", () => {
    for (const type of Object.keys(renderers)) {
      const def = SECTION_DEFINITIONS.find((d) => d.type === type)!;
      expect(Object.keys(renderers[type]!), type).toEqual([...def.variants]);
    }
    expect(Object.keys(renderers).sort()).toEqual(SECTION_DEFINITIONS.map((d) => d.type).sort());
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

describe("booking · closing", () => {
  const photo = { src: "/p.webp", alt: "The chair", srcSet: "/p-480.webp 480w" };
  const nextTime = { id: "t1", label: "Tomorrow 9 am", href: "#t1" };
  const base = { variant: "closing" as const, label: "Book", title: "Ready when you are", href: "#book", actionLabel: "Book" };

  it("is a section named by its h2, with the photo in a fixed box, lazy", () => {
    const { container } = render(<BookingSection {...base} photo={photo} nextTime={nextTime} nextTimeLabel="Next free time" secondary={{ label: "Call", href: "tel:+15145550100" }} />);
    expect(screen.getByRole("region", { name: "Ready when you are" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Ready when you are" })).toBeTruthy();
    expect(container.querySelector("[data-shop-photo]")!.getAttribute("data-ratio")).toBe("4/3");
    expect(container.querySelector("img")!.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("img")!.getAttribute("fetchpriority")).toBeNull();
  });

  it("shows the next free time as a text link, the primary « Book » and the secondary action", () => {
    render(<BookingSection {...base} nextTime={nextTime} secondary={{ label: "Call", href: "tel:+15145550100" }} />);
    expect(screen.getByRole("link", { name: "Tomorrow 9 am" }).getAttribute("href")).toBe("#t1");
    expect(screen.getByRole("link", { name: "Book" }).getAttribute("href")).toBe("#book");
    expect(screen.getByRole("link", { name: "Call" })).toBeTruthy();
  });

  it("without a free time or a photo: the title and the primary alone, never an empty box", () => {
    const { container } = render(<BookingSection {...base} mark={<svg data-testid="mark" />} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(container.querySelector("[aria-hidden]")!.querySelector("[data-testid=mark]")).toBeTruthy();
    expect(container.querySelector("[data-shop-photo]")).toBeNull();
  });

  it("holds no client code: it renders to static markup", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const html = renderToStaticMarkup(<BookingSection {...base} photo={photo} nextTime={nextTime} />);
    expect(html).toContain("Tomorrow 9 am");
    expect(html).not.toMatch(/<script/i);
  });

  it("has no axe violation, with and without a photo", async () => {
    const { container, rerender } = render(<BookingSection {...base} photo={photo} nextTime={nextTime} secondary={{ label: "Call", href: "tel:+15145550100" }} />);
    expect(await axeViolations(container)).toEqual([]);
    rerender(<BookingSection {...base} />);
    expect(await axeViolations(container)).toEqual([]);
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

describe("third parties load on a click, never before (Law 25)", () => {
  const noThirdParty = (html: string) => {
    expect(html).not.toMatch(/<iframe/i);
    expect(html).not.toMatch(/tiktok\.com\/embed|youtube\.com\/embed|instagram\.com\/(p|reel)\/[^"]*embed|<script[^>]+(tiktok|instagram|youtube)/i);
  };

  it("video · tv and video · shorts hold no frame and no platform script before the click", () => {
    for (const variant of ["tv", "shorts"] as const) {
      const { container, unmount } = render(<VideoSection variant={variant} title="Reels" reels={[reel]} playLabels={play} />);
      noThirdParty(container.innerHTML);
      expect(screen.getByRole("button", { name: "Load TikTok and play" })).toBeTruthy();
      unmount();
    }
  });

  it("social · facade holds no frame before the click, social · links are plain anchors with no referrer", () => {
    const facade = render(<SocialSection variant="facade" title="Follow us" links={[{ id: "a", platform: "tiktok", url: reel.url }]} playLabels={play} />);
    noThirdParty(facade.container.innerHTML);
    facade.unmount();
    const links = render(<SocialSection variant="links" title="Follow us" links={[{ id: "a", platform: "instagram", url: "https://instagram.com/salon" }]} />);
    const a = links.container.querySelector("a")!;
    expect(a.getAttribute("rel")).toBe("noopener noreferrer nofollow");
    expect(a.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(links.container.querySelector("iframe, script, img")).toBeNull();
  });

  it("visit · map draws a still and a button, and requests nothing from a map server until it is asked (a phone)", () => {
    noMotion(); // matchMedia answers « no »: a phone
    const { container } = render(<VisitSection variant="map" title="Visit" {...hoursProps(demoSalon)} map={mapProps} />);
    noThirdParty(container.innerHTML);
    expect(container.querySelector("canvas, .maplibregl-map")).toBeNull();
    expect(container.querySelector("[role=img]")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Show the map" })).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/pmtiles|b-cdn\.net\/maps/i);
  });
});

describe("reviews", () => {
  it("draws nothing under the host's minimum, in every variant", () => {
    for (const variant of ["summary-cards", "quote", "strip"] as const) {
      const { container, unmount } = render(<ReviewsSection variant={variant} title="Reviews" summary={{ ...summary, count: 3 }} reviews={reviewList} />);
      expect(container.innerHTML, variant).toBe("");
      unmount();
    }
    const { container } = render(<ReviewsSection title="Reviews" summary={{ ...summary, count: 3 }} minCount={2} reviews={reviewList} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("draws the first review as one quote, and the score in words for a screen reader", () => {
    render(<ReviewsSection variant="quote" title="Reviews" summary={summary} reviews={reviewList} />);
    expect(screen.getByText(/The best blow-dry/)).toBeTruthy();
    expect(screen.queryByText(/Jade listened/)).toBeNull();
  });
});

describe("bulletin", () => {
  const flyers = [
    { id: "new", text: "New: beard care", until: "2026-12-01" },
    { id: "old", text: "Black Friday", until: "2026-11-27" },
    { id: "gone", text: "Summer hours", until: "2026-08-31" },
    { id: "keep", text: "Gift cards" },
    { id: "extra", text: "A fourth one" },
  ];

  it("takes a flyer down after its last day (inclusive), keeps the others, three at most", () => {
    expect(liveFlyers(flyers, "2026-10-27").map((f) => f.id)).toEqual(["new", "old", "keep"]);
    expect(liveFlyers(flyers, "2026-11-27").map((f) => f.id)).toEqual(["new", "old", "keep"]);
    expect(liveFlyers(flyers, "2026-11-28").map((f) => f.id)).toEqual(["new", "keep", "extra"]);
    render(<BulletinSection title="News" today="2026-10-27" flyers={flyers} />);
    expect(screen.queryByText("Summer hours")).toBeNull();
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  it("draws nothing when every flyer has expired, and the banner is one line of text, never an image", () => {
    const { container, rerender } = render(<BulletinSection title="News" today="2027-01-01" flyers={flyers.slice(0, 3)} />);
    expect(container.innerHTML).toBe("");
    rerender(<BulletinSection variant="banner" title="News" today="2026-10-27" flyers={flyers} />);
    expect(container.querySelector("img, svg, picture, video")).toBeNull();
    expect(container.textContent).toBe("New: beard care");
  });
});

describe("faq", () => {
  it("is native details, with the FAQPage JSON-LD of the same answers", () => {
    const questions = [{ id: "q1", question: "Do I need to book?", answer: "Yes, online." }, { id: "q2", question: "Can I </script> cancel?", answer: "Up to 24 h before." }];
    const { container } = render(<FaqSection title="Questions" questions={questions} />);
    expect(container.querySelectorAll("details").length).toBe(2);
    const json = container.querySelector("script[type='application/ld+json']")!.textContent!;
    const data = JSON.parse(json);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => [q.name, q.acceptedAnswer.text])).toEqual(questions.map((q) => [q.question, q.answer]));
    expect(json).not.toContain("</script>");
    expect(faqJsonLd([])).toContain("FAQPage");
  });
});

describe("a whole page", () => {
  it("is one document: one h1, one h2 per section, unique landmarks, no axe violation", async () => {
    const { container } = render(<ShopPageExample />);
    expect(container.querySelectorAll("h1").length).toBe(1);
    const h2 = [...container.querySelectorAll("h2")].map((h) => h.textContent);
    expect(new Set(h2).size).toBe(h2.length);
    const photos = [...container.querySelectorAll("img")].map((i) => i.getAttribute("src"));
    expect(new Set(photos).size, "a photo twice on one page").toBe(photos.length);
    expect(await axeViolations(container)).toEqual([]);
  });
});
