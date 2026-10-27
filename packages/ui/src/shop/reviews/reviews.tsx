// Server-safe. What clients say (ADR-007 §3): `summary-cards` — the score stamp with its distribution beside two or three
// reviews; `quote` — one large review; `strip` — the score as one line (a hero's fact). Nothing is drawn under the host's
// `minCount` of verified reviews: a shop with two reviews shows none (the composer says why).
import { ReviewCard, type ReviewCardProps, ReviewSummary, type ReviewSummaryProps } from "@krizaka/ui/reviews";
import * as React from "react";

import { ShopSection } from "../frame";

export type ReviewsVariant = "summary-cards" | "quote" | "strip";

export type ShopReview = Omit<ReviewCardProps, "className" | "style"> & { id: string };

export type ReviewsSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "summary-cards" */
  variant?: ReviewsVariant;
  title: React.ReactNode;
  /** The score and its distribution, with the words that name them (the stamp's, the count's, the meters'). */
  summary: Omit<ReviewSummaryProps, "minCount" | "className" | "style">;
  /** The reviews the host chose (`best` or `latest`), in order: two or three are drawn. */
  reviews: readonly ShopReview[];
  /** How many reviews are drawn beside the stamp. @default 2 */
  count?: 1 | 2 | 3;
  /** The fewest verified reviews that may be shown at all. @default 5 */
  minCount?: number;
};

/** The score of the shop and what its clients wrote. */
export function ReviewsSection({ variant = "summary-cards", title, summary, reviews, count = 2, minCount = 5, className, ...props }: ReviewsSectionProps) {
  if (summary.count < Math.max(1, minCount) || reviews.length === 0) return null;
  const shown = reviews.slice(0, count);
  if (variant === "strip") {
    return (
      <ShopSection aria-label={typeof title === "string" ? title : summary.summaryText} data-variant="strip" className={className} {...props}>
        <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-fg-secondary">
          <span className="rounded-sm border-2 border-border-strong px-2 py-0.5 font-mono text-base font-bold text-fg tabular-nums">{summary.scoreText}</span>
          <span>{summary.countText}</span>
          <span className="sr-only">{summary.summaryText}</span>
        </p>
      </ShopSection>
    );
  }
  if (variant === "quote") {
    const r = shown[0]!;
    const { text, author, date, dateTime, service, ratingText } = r;
    return (
      <ShopSection title={title} className={className} data-variant="quote" {...props}>
        <figure className="m-0 max-w-3xl">
          <blockquote className="m-0 font-display text-2xl leading-snug text-fg sm:text-3xl">“{text}”</blockquote>
          <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm text-fg-secondary">
            <span className="font-semibold text-fg">{author}</span>
            <time dateTime={dateTime}>{date}</time>
            {service && <span>· {service}</span>}
            <span className="sr-only">{ratingText}</span>
          </figcaption>
        </figure>
      </ShopSection>
    );
  }
  return (
    <ShopSection title={title} className={className} data-variant="summary-cards" {...props}>
      <div className="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
        <ReviewSummary {...summary} minCount={minCount} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
          {shown.map(({ id, ...review }) => (
            <ReviewCard key={id} {...review} />
          ))}
        </div>
      </div>
    </ShopSection>
  );
}
