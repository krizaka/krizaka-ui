// Server-safe. The clients' word on a shop (krizaka-ui#606): a score you can trust. `ReviewSummary` — the score as a stamp,
// the count with « verified », five meters for the distribution and the text equivalent — and `ReviewCard`, one review with
// the owner's reply indented. All words are props. Never a « /20 »: that is `GradeStamp`'s school register.
import * as React from "react";

import { cn } from "../cn";
import { Meter } from "../meter/meter";
import { Stamp } from "../specimen-tag/specimen-tag";

export interface ReviewSummaryProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The score, 0 to 5 (the host's, already fair: the Bayesian average of the verified reviews). Drawn by `scoreText`. */
  score: number;
  /** How many verified reviews stand behind it. */
  count: number;
  /** How many reviews per rating, `[1 star … 5 stars]`. */
  distribution: readonly [number, number, number, number, number];
  /** Renders nothing under this many reviews: a score from two people is not a score. @default 1 */
  minCount?: number;
  /** The stamp's text, formatted for the reader ("4,8 / 5"). */
  scoreText: string;
  /** The count with its « verified » ("27 avis vérifiés"). */
  countText: string;
  /** The whole thing in one sentence, for assistive technology ("4,8 sur 5, 27 avis vérifiés"). */
  summaryText: string;
  /** The name and value of one distribution meter ("5 étoiles : 20 avis"). */
  starText: (stars: number, count: number) => string;
}

/** The score of a shop as a stamp, with the distribution of its verified reviews: nothing under the host's minimum. */
export function ReviewSummary({ score, count, distribution, minCount = 1, scoreText, countText, summaryText, starText, className, ...props }: ReviewSummaryProps) {
  const id = React.useId();
  if (!(count >= Math.max(1, minCount))) return null;
  return (
    <div role="group" aria-labelledby={id} data-score={score} className={cn("kz-reviews", className)} {...props}>
      <span id={id} className="sr-only">{summaryText}</span>
      <p className="kz-reviews-visual" aria-hidden="true">
        <Stamp tone="ink" data-figure="">{scoreText}</Stamp>
        <span className="kz-reviews-count">{countText}</span>
      </p>
      <ul className="kz-reviews-bars">
        {[5, 4, 3, 2, 1].map((stars) => {
          const n = distribution[stars - 1] ?? 0;
          return (
            <li key={stars}>
              <span className="kz-reviews-rank" aria-hidden="true">{stars} ★</span>
              <Meter label={starText(stars, n)} value={n} min={0} max={count} valueText={starText(stars, n)} size="sm" />
              <span className="kz-reviews-n" aria-hidden="true">{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface ReviewCardProps extends Omit<React.ComponentProps<"article">, "children"> {
  /** First name and initial ("Camille L."). */
  author: string;
  /** The month, formatted for the reader ("octobre 2026"). */
  date: string;
  /** The machine-readable date of `date` ("2026-10"). */
  dateTime: string;
  /** The service reviewed. */
  service?: string;
  /** The rating, 1 to 5. */
  rating: number;
  /** The rating in words ("5 sur 5"). */
  ratingText: string;
  /** The review. */
  text: string;
  /** The owner's reply, indented under the review. */
  reply?: { label: string; author: string; text: string };
}

const STAR = "M8 1.6l1.9 4.1 4.5.5-3.3 3 .9 4.4L8 11.4 4 13.6l.9-4.4-3.3-3 4.5-.5Z";

/** One review: who, when, which service, the rating and the words — and the owner's reply. */
export function ReviewCard({ author, date, dateTime, service, rating, ratingText, text, reply, className, ...props }: ReviewCardProps) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <article className={cn("kz-review", className)} {...props}>
      <header className="kz-review-head">
        <p className="kz-review-author">{author}</p>
        <p className="kz-review-meta">
          <time dateTime={dateTime}>{date}</time>
          {service && <span>{service}</span>}
        </p>
        <p className="kz-review-rating">
          <span className="kz-review-stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <svg key={n} viewBox="0 0 16 16" width="16" height="16" focusable="false" data-filled={n <= filled ? "" : undefined}><path d={STAR} /></svg>
            ))}
          </span>
          <span className="sr-only">{ratingText}</span>
        </p>
      </header>
      <p className="kz-review-text">{text}</p>
      {reply && (
        <div className="kz-review-reply">
          <p className="kz-review-reply-label">{reply.label} · {reply.author}</p>
          <p className="kz-review-reply-text">{reply.text}</p>
        </div>
      )}
    </article>
  );
}
