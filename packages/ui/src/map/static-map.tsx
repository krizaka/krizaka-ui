// Server-safe. A still map drawn without an engine: the places projected (Web Mercator) on the map's paper — or on a
// picture of the area (`image`, a snapshot of the real map) — in the page's tokens. What a `Map` shows while its engine
// loads and for good without WebGL; a picture for an e-mail, a card, a list item. An image (`role="img"`) named by its
// places.


import { tv } from "../tv";
import { MAP_ATTRIBUTION } from "./assets";
import { type LngLat, project } from "./geo";

export const staticMap = tv({
  slots: {
    root: "relative block h-full w-full overflow-hidden bg-surface-2",
    svg: "absolute inset-0 h-full w-full",
    attribution: "absolute bottom-1.5 right-1.5 rounded-md bg-surface-1/85 px-1.5 py-0.5 text-[10px] text-fg-secondary",
  },
});

export type StaticMapPlace = { position: LngLat; label: string };

export type StaticMapProps = {
  /** What the picture shows, in words ("Three pick-up points in the Plateau"), passed translated: its accessible name. */
  label: string;
  /** The centre of the picture. */
  center: LngLat;
  /** The zoom of the picture. Default 12. */
  zoom?: number;
  /** The places drawn on it (an accent dot each), listed in its name. */
  places?: readonly StaticMapPlace[];
  /** A snapshot of the real map of the area (same centre and zoom), drawn under the places; the attribution then shows. */
  image?: string;
  /** Classes merged on the root (its size). */
  className?: string;
};

const W = 640;
const H = 400;

/** A still map: the places on the map's paper (or on a snapshot), named in words. */
export function StaticMap({ label, center, zoom = 12, places = [], image, className }: StaticMapProps) {
  const s = staticMap();
  const [cx, cy] = project(center, zoom);
  const at = (p: LngLat) => {
    const [x, y] = project(p, zoom);
    return [W / 2 + x - cx, H / 2 + y - cy] as const;
  };
  const name = places.length ? `${label}: ${places.map((p) => p.label).join(", ")}` : label;
  return (
    <span role="img" aria-label={name} className={s.root({ className })}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={s.svg()} aria-hidden>
        <defs>
          <pattern id="kz-map-paper" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--kz-border-subtle)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="var(--kz-surface-2)" />
        {image ? <image href={image} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" /> : <rect width={W} height={H} fill="url(#kz-map-paper)" />}
        {places.map((p) => {
          const [x, y] = at(p.position);
          return (
            <g key={`${p.position[0]},${p.position[1]}`}>
              <circle cx={x} cy={y} r="12" fill="var(--kz-accent)" opacity="0.18" />
              <circle cx={x} cy={y} r="7" fill="var(--kz-accent)" stroke="var(--kz-on-accent)" strokeWidth="2.5" />
            </g>
          );
        })}
      </svg>
      {image ? (
        <span aria-hidden className={s.attribution()}>
          {MAP_ATTRIBUTION.protomaps} · {MAP_ATTRIBUTION.osm}
        </span>
      ) : null}
    </span>
  );
}

