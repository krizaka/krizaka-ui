"use client";

import * as React from "react";

import { cn } from "../cn";
import { type ShopGalleryLabels, shopGalleryLabels } from "./labels";

// The lightbox is a lazy chunk: nothing of it is loaded until a photo is opened.
const Lightbox = React.lazy(() => import("./lightbox"));

export type ShopGalleryPhoto = {
  id: string;
  /** The tile's image. */
  src: string;
  /** What it shows, in words: the tile's name and the lightbox's caption. */
  alt: string;
  /** The widths the product holds (`/a-400.avif 400w, /a-800.avif 800w, /a-1200.avif 1200w`). */
  srcSet?: string;
  /** The lightbox's image at full resolution (default: `src`). */
  fullSrc?: string;
  fullSrcSet?: string;
};

export type ShopGalleryProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The shop's photos, in order, already unique. */
  photos: readonly ShopGalleryPhoto[];
  /** The gallery's accessible name (`Photos of the salon`). */
  label: string;
  /** The tiles' `sizes` (default: the bento's share of a 72 rem page on a desktop, 78 vw on a phone). */
  sizes?: string;
  /** Translated texts; `shopGalleryLabelsFr` for French. */
  labels?: Partial<ShopGalleryLabels>;
};

const BENTO = 5;

const styles = `
.kz-sg{position:relative}
.kz-sg-list{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem}
.kz-sg-tile{position:relative;display:block;width:100%;height:100%;padding:0;overflow:hidden;cursor:zoom-in;border:1px solid var(--kz-border-subtle);border-radius:var(--kz-shop-photo-radius,.75rem);background:var(--kz-surface-2);color:var(--kz-text-on-media)}
.kz-sg-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kz-sg-tile:focus-visible{outline:2px solid var(--kz-ring);outline-offset:2px}
.kz-sg-list>li{aspect-ratio:1/1;min-width:0}
.kz-sg-list>li:first-child:nth-last-child(odd){grid-column:span 2;aspect-ratio:16/10}
.kz-sg-more,.kz-sg-count{display:none}
.kz-sg[data-strip=true] .kz-sg-list{display:flex;gap:.75rem;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-inline:-1rem;padding-inline:1rem;scroll-padding-inline:1rem;-webkit-mask-image:linear-gradient(to right,transparent,currentcolor 1.25rem,currentcolor calc(100% - 1.25rem),transparent);mask-image:linear-gradient(to right,transparent,currentcolor 1.25rem,currentcolor calc(100% - 1.25rem),transparent)}
.kz-sg[data-strip=true] .kz-sg-list::-webkit-scrollbar{display:none}
.kz-sg[data-strip=true] .kz-sg-list>li{flex:0 0 78%;aspect-ratio:4/5;scroll-snap-align:start}
.kz-sg[data-strip=true] .kz-sg-list>li:first-child:nth-last-child(odd){grid-column:auto;aspect-ratio:4/5}
.kz-sg[data-strip=true] .kz-sg-count{display:block;margin:.5rem 0 0;text-align:end;font:600 .75rem/1 var(--kz-font-mono,monospace);color:var(--kz-text-secondary)}
@media (prefers-reduced-motion:no-preference){.kz-sg[data-strip=true] .kz-sg-list{scroll-behavior:smooth}.kz-sg-tile img{transition:transform .35s ease}.kz-sg-tile:hover img{transform:scale(1.03)}}
@media (min-width:40rem){
.kz-sg-list{gap:.75rem}
.kz-sg[data-strip=true] .kz-sg-list{display:grid;overflow:visible;margin-inline:0;padding-inline:0;-webkit-mask-image:none;mask-image:none}
.kz-sg[data-strip=true] .kz-sg-count{display:none}
.kz-sg[data-count="1"] .kz-sg-list{grid-template-columns:1fr}
.kz-sg[data-count="1"] .kz-sg-list>li{aspect-ratio:16/9}
.kz-sg[data-count="2"] .kz-sg-list>li,.kz-sg[data-count="2"] .kz-sg-list>li:first-child:nth-last-child(odd){aspect-ratio:4/3;grid-column:auto}
.kz-sg:not([data-count="1"]):not([data-count="2"]) .kz-sg-list{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));aspect-ratio:2/1}
.kz-sg:not([data-count="1"]):not([data-count="2"]) .kz-sg-list>li,.kz-sg[data-strip=true] .kz-sg-list>li{aspect-ratio:auto;flex:none}
.kz-sg:not([data-count="1"]):not([data-count="2"]) .kz-sg-list>li:first-child{grid-column:1/3;grid-row:1/3;aspect-ratio:auto}
.kz-sg[data-count="3"] .kz-sg-list>li:nth-child(n+2){grid-column:3/5}
.kz-sg[data-count="4"] .kz-sg-list>li:nth-child(2){grid-column:3/5}
.kz-sg[data-strip=true] .kz-sg-list>li:nth-child(n+6){display:none}
.kz-sg[data-more=true] .kz-sg-list>li:nth-child(5) .kz-sg-more{position:absolute;inset:0;display:grid;place-items:center;background:color-mix(in srgb,var(--kz-scrim-strong) 62%,transparent);font:700 1.125rem/1.2 var(--kz-font-sans,system-ui);text-align:center}
}
`;

/** A shop's photos: a bento mosaic (one 2×2 lead and four tiles, the last one « + N photos »), a snap strip on a phone, and a lightbox. */
export function ShopGallery({ photos, label, sizes, labels: given, className, ...props }: ShopGalleryProps) {
  const labels = { ...shopGalleryLabels, ...given };
  const total = photos.length;
  const strip = total >= BENTO;
  const [open, setOpen] = React.useState<number | null>(null);
  const [current, setCurrent] = React.useState(1);
  const tiles = React.useRef<(HTMLButtonElement | null)[]>([]);
  const opener = React.useRef<number>(0);
  if (total === 0) return null;

  const tileSizes = sizes ?? (strip ? "(min-width: 40rem) 36rem, 78vw" : "(min-width: 40rem) 36rem, 50vw");
  const onScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const list = event.currentTarget;
    const first = list.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 12 : 0;
    if (step > 0) setCurrent(Math.min(total, Math.max(1, Math.round(list.scrollLeft / step) + 1)));
  };
  return (
    <div className={cn("kz-sg", className)} data-count={total} data-strip={strip || undefined} data-more={total > BENTO || undefined} role="group" aria-label={label} {...props}>
      <style>{styles}</style>
      <ul className="kz-sg-list" onScroll={strip ? onScroll : undefined}>
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              ref={(node) => {
                tiles.current[i] = node;
              }}
              className="kz-sg-tile"
              aria-label={i === BENTO - 1 && total > BENTO ? `${labels.more(total - BENTO + 1)}: ${labels.open(photo.alt, i + 1, total)}` : labels.open(photo.alt, i + 1, total)}
              onClick={() => {
                opener.current = i;
                setOpen(i);
              }}
            >
              <img src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? tileSizes : undefined} alt="" loading="lazy" decoding="async" />
              {i === BENTO - 1 && total > BENTO && <span className="kz-sg-more" aria-hidden>{labels.more(total - BENTO + 1)}</span>}
            </button>
          </li>
        ))}
      </ul>
      {strip && <p className="kz-sg-count" aria-hidden>{labels.counter(current, total)}</p>}
      {open !== null && (
        <React.Suspense fallback={null}>
          <Lightbox
            photos={photos}
            index={open}
            onIndexChange={setOpen}
            onClose={() => setOpen(null)}
            label={label}
            labels={labels}
            returnFocus={() => tiles.current[opener.current] ?? null}
          />
        </React.Suspense>
      )}
    </div>
  );
}
