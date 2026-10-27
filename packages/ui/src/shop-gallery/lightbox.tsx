"use client";

// The lightbox: loaded as a lazy chunk, only once a photo is opened. A Dialog (focus trapped, Escape, scroll lock), arrow
// keys and a horizontal swipe, the photo at full resolution and its alt text as the caption.
import * as React from "react";

import { IconButton } from "../button/button";
import { Dialog } from "../dialog";
import type { ShopGalleryLabels } from "./labels";
import type { ShopGalleryPhoto } from "./shop-gallery";

const SWIPE = 50;

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}

export type ShopGalleryLightboxProps = {
  photos: readonly ShopGalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  label: string;
  labels: ShopGalleryLabels;
  /** Where focus goes back to when it closes. */
  returnFocus: () => HTMLElement | null;
};

export default function ShopGalleryLightbox({ photos, index, onIndexChange, onClose, label, labels, returnFocus }: ShopGalleryLightboxProps) {
  const total = photos.length;
  const photo = photos[index];
  const startX = React.useRef<number | null>(null);
  const go = (to: number) => onIndexChange(((to % total) + total) % total);
  if (!photo) return null;
  const preload = [photos[(index + 1) % total], photos[(index - 1 + total) % total]];
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content
        closeLabel={labels.close}
        size="lg"
        className="kz-sg-lightbox sm:max-w-5xl"
        onCloseAutoFocus={(event) => {
          const target = returnFocus();
          if (target) {
            event.preventDefault();
            target.focus();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(index - 1);
          else if (event.key === "ArrowRight") go(index + 1);
        }}
      >
        <style>{`.kz-sg-stage{touch-action:pan-y}.kz-sg-lightbox img{user-select:none;-webkit-user-drag:none}@media (prefers-reduced-motion:no-preference){.kz-sg-photo{animation:kz-sg-in .22s ease-out}}@keyframes kz-sg-in{from{opacity:.4}to{opacity:1}}`}</style>
        <Dialog.Header>
          <Dialog.Title className="sr-only">{labels.title(label)}</Dialog.Title>
          <p className="m-0 text-sm text-fg-secondary" aria-live="polite">{labels.position(index + 1, total)}</p>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-3">
          <div
            className="kz-sg-stage relative flex items-center justify-center"
            onTouchStart={(event) => {
              startX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const from = startX.current;
              const to = event.changedTouches[0]?.clientX;
              startX.current = null;
              if (from === null || to === undefined) return;
              if (to - from <= -SWIPE) go(index + 1);
              else if (to - from >= SWIPE) go(index - 1);
            }}
          >
            <img
              key={photo.id}
              src={photo.fullSrc ?? photo.src}
              srcSet={photo.fullSrcSet ?? photo.srcSet}
              sizes={photo.fullSrcSet ?? photo.srcSet ? "(min-width: 64rem) 64rem, 100vw" : undefined}
              alt={photo.alt}
              decoding="async"
              className="kz-sg-photo max-h-[68dvh] w-full rounded-lg object-contain"
            />
            {total > 1 && (
              <>
                <IconButton label={labels.previous} variant="secondary" shape="pill" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => go(index - 1)}>
                  <Arrow dir="left" />
                </IconButton>
                <IconButton label={labels.next} variant="secondary" shape="pill" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => go(index + 1)}>
                  <Arrow dir="right" />
                </IconButton>
              </>
            )}
          </div>
          <Dialog.Description className="m-0 min-h-5 text-center">{photo.alt}</Dialog.Description>
          <div hidden aria-hidden>
            {preload.map((p) => p && p.id !== photo.id && <img key={p.id} src={p.fullSrc ?? p.src} alt="" />)}
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
