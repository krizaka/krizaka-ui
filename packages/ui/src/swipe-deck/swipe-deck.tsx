// Client (the drag, the decision). A deck of cards decided one by one — drag right to like, left to pass, or the
// buttons, or ← → on the focused deck — and `PersonCard`, a person on a card. Reduced motion: the card leaves without
// flying.
import * as React from "react";
import { tv } from "tailwind-variants";

import { warnDeprecated } from "../deprecated";
import { usePrefersReducedMotion } from "../media";

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const swipeDeck = tv({
  slots: {
    root: "flex w-full flex-col items-center gap-5",
    stack: "relative aspect-[3/4] w-full max-w-sm outline-hidden focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-surface-0",
    layer: "absolute inset-0 touch-pan-y select-none",
    stamp: "pointer-events-none absolute top-8 rounded-lg border-[3px] px-2.5 py-0.5 font-display text-2xl font-black ",
    buttons: "flex items-center gap-7",
    button:
      "inline-flex h-16 w-16 items-center justify-center rounded-full border-2 bg-surface-1 shadow-md transition-transform active:scale-90 " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 motion-reduce:transition-none [&>svg]:h-7 [&>svg]:w-7",
    card: "relative h-full w-full overflow-hidden rounded-2xl bg-surface-3 shadow-lg",
    photo: "absolute inset-0 h-full w-full object-cover",
    bars: "absolute inset-x-2 top-2 flex gap-1",
    bar: "h-[3px] flex-1 rounded-full bg-fg-on-media opacity-40 data-[on]:opacity-100",
    half: "absolute top-0 bottom-2/5 w-2/5 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    info: "absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-scrim-strong via-scrim-strong/80 to-transparent p-4 pt-24 text-fg-on-media",
    name: "flex items-center gap-2 font-display text-3xl font-black",
    age: "font-sans text-2xl font-normal",
    bio: "line-clamp-2 text-sm",
    footer: "mt-1 flex flex-wrap gap-1.5",
  },
});

export type PersonCardProps = {
  /** The person's photos (URLs), the first shown first; click a side, or its buttons, to move between them. */
  photos: readonly { src: string; alt?: string }[];
  /** The name. */
  name: string;
  /** The age, written after the name. */
  age?: number;
  /** Beside the name: a `VerifiedBadge`. */
  badge?: React.ReactNode;
  /** A line under the name: a distance, a job. */
  meta?: React.ReactNode;
  /** A sentence about the person. */
  bio?: string;
  /** At the bottom: the interests as chips. */
  footer?: React.ReactNode;
  /** The photo buttons' words: `{ previous: "Previous photo", next: "Next photo" }` — passed translated. */
  photoLabels?: { previous: string; next: string };
  /** Classes merged on the card. */
  className?: string;
};

/**
 * A person on a card: photos full bleed (a side to change), name and age over a scrim, a line, a bio, chips.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function PersonCard({ photos, name, age, badge, meta, bio, footer, photoLabels = { previous: "Previous photo", next: "Next photo" }, className }: PersonCardProps) {
  warnDeprecated("swipe-deck");
  const s = swipeDeck();
  const [index, setIndex] = React.useState(0);
  const photo = photos[index];
  return (
    <article aria-label={age !== undefined ? `${name}, ${age}` : name} className={s.card({ className })}>
      {photo ? <img src={photo.src} alt={photo.alt ?? ""} className={s.photo()} draggable={false} /> : null}
      {photos.length > 1 ? (
        <>
          <div className={s.bars()} aria-hidden>
            {photos.map((_, i) => (
              <span key={i} className={s.bar()} data-on={i === index || undefined} />
            ))}
          </div>
          <button type="button" aria-label={photoLabels.previous} disabled={index === 0} className={s.half({ className: "left-0" })} onClick={() => setIndex((i) => Math.max(0, i - 1))} />
          <button type="button" aria-label={photoLabels.next} disabled={index === photos.length - 1} className={s.half({ className: "right-0" })} onClick={() => setIndex((i) => Math.min(photos.length - 1, i + 1))} />
        </>
      ) : null}
      <div className={s.info()}>
        <h3 className={s.name()}>
          <span className="truncate">
            {name}
            {age !== undefined ? <span className={s.age()}>{`  ${age}`}</span> : null}
          </span>
          {badge}
        </h3>
        {meta}
        {bio ? <p className={s.bio()}>{bio}</p> : null}
        {footer ? <div className={s.footer()}>{footer}</div> : null}
      </div>
    </article>
  );
}

export type SwipeDirection = "like" | "pass";

export type SwipeDeckLabels = {
  /** The like button (“Like”). */
  like: string;
  /** The pass button (“Pass”). */
  pass: string;
  /** The deck's name and its keyboard hint (“Profiles. Right arrow to like, left arrow to pass.”). */
  deck: string;
  /** The stamp while dragging right (“LIKE”). */
  likeStamp?: string;
  /** The stamp while dragging left (“NOPE”). */
  passStamp?: string;
  /** Announced after a decision: `(name, direction) => …`. */
  decided?: (name: string, direction: SwipeDirection) => string;
};

export type SwipeDeckProps<T> = {
  /** The cards still to decide, the first on top. */
  items: readonly T[];
  /** A card's id. */
  getId: (item: T) => string;
  /** A card's name, for the announcements. */
  getName: (item: T) => string;
  /** A card (usually a `PersonCard`). */
  renderCard: (item: T) => React.ReactNode;
  /** Called with the card decided and the decision; remove it from `items`. */
  onSwipe: (item: T, direction: SwipeDirection) => void;
  /** Shown when there is no card left (an `EmptyState`). */
  empty?: React.ReactNode;
  /** The words, passed translated. */
  labels: SwipeDeckLabels;
  /** Classes merged on the root. */
  className?: string;
};

/**
 * A deck of cards decided one by one: drag, the buttons, or ← → — each decision announced.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function SwipeDeck<T>({ items, getId, getName, renderCard, onSwipe, empty, labels, className }: SwipeDeckProps<T>) {
  warnDeprecated("swipe-deck");
  const s = swipeDeck();
  const reduce = usePrefersReducedMotion();
  const [dx, setDx] = React.useState(0);
  const [leaving, setLeaving] = React.useState<SwipeDirection | null>(null);
  const [message, setMessage] = React.useState("");
  const start = React.useRef<{ x: number; width: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const top = items[0];
  const decide = (direction: SwipeDirection) => {
    if (!top || leaving) return;
    const finish = () => {
      setLeaving(null);
      setDx(0);
      setMessage(labels.decided ? labels.decided(getName(top), direction) : `${getName(top)}: ${direction === "like" ? labels.like : labels.pass}`);
      onSwipe(top, direction);
    };
    if (reduce) return finish();
    setLeaving(direction);
    setTimeout(finish, 220);
  };
  const offset = leaving ? (leaving === "like" ? 1 : -1) * 900 : dx;
  const stampOpacity = (dir: 1 | -1) => Math.max(0, Math.min(1, (dir * offset) / 120));
  return (
    <div className={s.root({ className })}>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
      <div
        role="group"
        aria-label={labels.deck}
        tabIndex={top ? 0 : -1}
        className={s.stack()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") decide("like");
          if (e.key === "ArrowLeft") decide("pass");
        }}
      >
        {!top ? empty : null}
        {items
          .slice(0, 2)
          .reverse()
          .map((item) => {
            const isTop = item === top;
            return (
              <div
                key={getId(item)}
                aria-hidden={!isTop || undefined}
                inert={!isTop || undefined}
                className={s.layer()}
                style={
                  isTop
                    ? { transform: `translateX(${offset}px) rotate(${offset / 22}deg)`, transition: dragging && !leaving ? "none" : reduce ? "none" : "transform 220ms var(--kz-ease, ease-out)" }
                    : { transform: "scale(0.96)", opacity: 0.9 }
                }
                onPointerDown={(e) => {
                  if (!isTop || (e.target as HTMLElement).closest("button")) return;
                  start.current = { x: e.clientX, width: e.currentTarget.offsetWidth };
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragging(true);
                }}
                onPointerMove={(e) => {
                  if (start.current) setDx(e.clientX - start.current.x);
                }}
                onPointerUp={() => {
                  const width = start.current?.width ?? 300;
                  start.current = null;
                  setDragging(false);
                  if (dx > width / 3) decide("like");
                  else if (dx < -width / 3) decide("pass");
                  else setDx(0);
                }}
              >
                {renderCard(item)}
                {isTop ? (
                  <>
                    <span aria-hidden className={s.stamp({ className: "left-6 -rotate-12 border-success text-fg-success" })} style={{ opacity: stampOpacity(1) }}>
                      {labels.likeStamp ?? labels.like}
                    </span>
                    <span aria-hidden className={s.stamp({ className: "right-6 rotate-12 border-danger text-fg-danger" })} style={{ opacity: stampOpacity(-1) }}>
                      {labels.passStamp ?? labels.pass}
                    </span>
                  </>
                ) : null}
              </div>
            );
          })}
      </div>
      <div className={s.buttons()}>
        <button type="button" aria-label={labels.pass} disabled={!top} onClick={() => decide("pass")} className={s.button({ className: "border-danger text-fg-danger" })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <button type="button" aria-label={labels.like} disabled={!top} onClick={() => decide("like")} className={s.button({ className: "border-success text-fg-success" })}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
