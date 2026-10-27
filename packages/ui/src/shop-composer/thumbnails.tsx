"use client";

// The variant picker's thumbnails (ADR-007 §5): the section itself, drawn with demo data at the scale of a card — not a screenshot,
// so a new variant or a new preset needs no new picture, and each thumbnail wears the page's look (the preset applies around it).
import * as React from "react";

import { Button } from "../button/button";
import { BookingSection } from "../shop/booking/booking";
import { BulletinSection } from "../shop/bulletin/bulletin";
import type { SectionType } from "../shop/catalogue";
import { demoSalon } from "../shop/demo";
import { FaqSection } from "../shop/faq/faq";
import { ShopFrame } from "../shop/frame";
import { GallerySection } from "../shop/gallery/gallery";
import { HeroSection } from "../shop/hero/hero";
import { PoliciesSection } from "../shop/policies/policies";
import { ReviewsSection } from "../shop/reviews/reviews";
import { ServicesSection } from "../shop/services/services";
import { SocialSection } from "../shop/social/social";
import { StorySection } from "../shop/story/story";
import { TeamSection } from "../shop/team/team";
import { VideoSection } from "../shop/video/video";
import { VisitSection } from "../shop/visit/visit";

const shop = demoSalon;
const play = { tiktok: "Play", "youtube-shorts": "Play", instagram: "Play" } as const;
const reel = { id: "r", platform: "tiktok" as const, url: "https://www.tiktok.com/@salon/video/7000000000000000000", title: "Reel" };
const summary = {
  score: 4.7, count: 38, distribution: [0, 1, 2, 7, 28] as [number, number, number, number, number],
  scoreText: "4.7 / 5", countText: "38 reviews", summaryText: "4.7 out of 5, 38 reviews", starText: (s: number, n: number) => `${s} stars: ${n}`,
};
const review = { id: "a", author: "Nadia F.", date: "October 2026", dateTime: "2026-10", service: "Cut and blow-dry", rating: 5, ratingText: "5 out of 5", text: "The best blow-dry in the neighbourhood, simply." };

/** The section as it looks with demo data, in the variant asked. */
function Demo({ type, variant }: { type: SectionType; variant: string }): React.ReactNode {
  const v = variant as never;
  switch (type) {
    case "hero":
      return <HeroSection variant={v} title={shop.name} eyebrow={shop.eyebrow} lead={shop.promise} cover={shop.cover} actions={<Button variant="primary">Book</Button>} tv={{ poster: shop.cover.src, title: "Latest video" } as never} />;
    case "services":
      return <ServicesSection variant={v} title="Services" services={shop.services} chooseLabel="Choose" popularLabel="Popular" />;
    case "booking":
      return variant === "sticky" ? <div className="flex items-center justify-center border-t border-border-default bg-surface-1 p-4"><Button variant="primary" size="lg">Book</Button></div> : <BookingSection variant={v} label="Next free times" times={shop.times} href="#" actionLabel="Book" title="Ready when you are" body="A few taps." />;
    case "gallery":
      return <GallerySection variant={v} title="Photos" label="Photos" photos={shop.photos} sign={shop.name} />;
    case "video":
      return <VideoSection variant={v} title="Latest" reels={[reel, { ...reel, id: "r2" }]} playLabels={play} />;
    case "reviews":
      return <ReviewsSection variant={v} title="Reviews" summary={summary} reviews={[review, { ...review, id: "b", author: "Léo P." }]} />;
    case "bulletin":
      return <BulletinSection variant={v} title="News" today="2026-10-27" flyers={[{ id: "f", text: "Closed on Monday the 3rd: see you on Tuesday!", signature: "Jade" }]} />;
    case "team":
      return <TeamSection variant={v} title="Team" members={shop.team.map((t) => ({ id: t.id, name: t.name, role: "Stylist" }))} />;
    case "visit":
      return <VisitSection variant={v} title="Visit" hours={shop.hours} status={shop.status} hoursLabel="Hours" address={shop.address} phone={{ href: "tel:5145550110", label: shop.phone }} map={{ label: "Map", center: [-73.58, 45.48], showLabel: "Show the map" }} />;
    case "story":
      return <StorySection variant={v} title="Our story" quote="Cuts that last, advice that is honest." body="Three friends opened the salon in 2019, on the corner where the old bakery stood." owner={{ name: "Jade" }} />;
    case "social":
      return <SocialSection variant={v} title="Follow us" links={[{ id: "a", platform: "instagram", url: "https://instagram.com/salon" }, { id: "b", platform: "tiktok", url: "https://tiktok.com/@salon" }]} playLabels={play} />;
    case "faq":
      return <FaqSection title="Questions" questions={[{ id: "q", question: "Do I need to book?", answer: "Yes, pick a time online." }, { id: "q2", question: "Can I cancel?", answer: "Up to 24 hours before." }]} />;
    case "policies":
      return <PoliciesSection title="Policies" items={[{ id: "p", term: "Cancellation", details: "Free up to 24 h before" }, { id: "p2", term: "Prices", details: "Before taxes" }]} />;
  }
}

export type SectionThumbnailProps = {
  /** The section type. */
  type: SectionType;
  /** Its variant: one of the type's. */
  variant: string;
  /** The look preset the page wears (`salon-vitrine`): the thumbnail wears it too. */
  preset?: string;
  /** The page's spacing. @default "compact" */
  density?: "compact" | "airy";
};

/** A picture of a section: 160 × 96 px of a 960 px page, inert and hidden from assistive technology. */
export function SectionThumbnail({ type, variant, preset, density }: SectionThumbnailProps) {
  return (
    <div aria-hidden inert className="kz-shop-thumb" data-thumb={`${type}.${variant}`}>
      <div className="kz-shop-thumb-inner">
        <ShopFrame preset={preset} density={density ?? "compact"}>
          <Demo type={type} variant={variant} />
        </ShopFrame>
      </div>
    </div>
  );
}
