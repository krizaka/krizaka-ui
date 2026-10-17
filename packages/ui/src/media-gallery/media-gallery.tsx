// Client (the reader's motion preference). A shop's photos and loops in tiles: the first is the featured one, loops play
// muted while their tile is on screen (a still under reduced motion), a caption rides the foot of a tile.
import * as React from "react";
import { tv } from "tailwind-variants";

export const mediaGallery = tv({
  slots: {
    root: "m-0 grid list-none grid-cols-2 gap-2 p-0 sm:gap-3 md:grid-cols-4",
    tile:
      "group relative isolate m-0 overflow-hidden rounded-xl border border-border-default bg-media data-[featured]:col-span-2 data-[featured]:row-span-2 " +
      "aspect-[3/4] data-[shape=wide]:aspect-[4/3] data-[featured]:aspect-auto",
    media: "h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105",
    caption: "pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-scrim-strong to-transparent p-3 pt-8 text-xs font-semibold text-fg-on-media",
  },
});
const s = mediaGallery();

export type GalleryMedia = {
  /** A stable id. */
  id: string;
  /** The still: a photo, or the poster of a loop. */
  src: string;
  /** What it shows, in words. */
  alt: string;
  /** A muted loop: WebM first, MP4 for Safari. */
  video?: { webm?: string; mp4?: string };
  /** One line over the foot of the tile. */
  caption?: string;
  /** `wide` for a landscape source (4:3 tile); the default tile is a 3:4 portrait. */
  shape?: "portrait" | "wide";
};

export type MediaGalleryProps = Omit<React.ComponentProps<"ul">, "children"> & {
  /** The photos and loops, the featured one first. */
  items: readonly GalleryMedia[];
  /** The gallery's accessible name, passed translated. */
  label: string;
};

function Tile({ item, featured }: { item: GalleryMedia; featured: boolean }) {
  const ref = React.useRef<HTMLLIElement>(null);
  const [play, setPlay] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!item.video || !node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setPlay(Boolean(entry?.isIntersecting)), { rootMargin: "120px" });
    io.observe(node);
    return () => io.disconnect();
  }, [item.video]);
  return (
    <li ref={ref} className={s.tile()} data-featured={featured ? "" : undefined} data-shape={item.shape ?? "portrait"}>
      <figure className="m-0 h-full w-full">
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className={s.media()} />
        {play && item.video && (
          <video className={s.media({ className: "absolute inset-0" })} poster={item.src} autoPlay muted loop playsInline preload="none" aria-hidden tabIndex={-1}>
            {item.video.webm && <source src={item.video.webm} type="video/webm" />}
            {item.video.mp4 && <source src={item.video.mp4} type="video/mp4" />}
          </video>
        )}
        {item.caption && <figcaption className={s.caption()}>{item.caption}</figcaption>}
      </figure>
    </li>
  );
}

/** Photos and loops in tiles, the first featured; loops play while seen. */
export function MediaGallery({ items, label, className, ...props }: MediaGalleryProps) {
  return (
    <ul aria-label={label} className={s.root({ className })} {...props}>
      {items.map((item, i) => (
        <Tile key={item.id} item={item} featured={i === 0 && items.length > 2} />
      ))}
    </ul>
  );
}
