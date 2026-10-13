// Client. A map of the Krizaka family on MapLibre GL JS (open source) over Protomaps tiles on our CDN — no API key, no
// metered service. MapLibre and PMTiles are optional peers, loaded when a map is shown (a dynamic import: a page without
// a map never pays for them). The style comes from the tokens (`mapStyle`), in the page's scheme, and follows it.
//
// What every map does: the canvas is decorative for assistive technologies — the map is a region named by `label`, its
// places a list read in order (the text alternative, `MapPlaces`), each marker a button when it does something; the
// attribution of OpenStreetMap (ODbL) and Protomaps is always shown; under reduced motion the camera jumps, never flies;
// without WebGL (or while the engine loads) `fallback` stands in its place.
/// <reference types="geojson" />
import * as React from "react";
import { createPortal } from "react-dom";

import { usePrefersReducedMotion } from "../media";
import { tv } from "../tv";
import { MAP_ATTRIBUTION } from "./assets";
import { circlePolygon, type LngLat } from "./geo";
import { type MapBrand, mapPalette, type MapRegion, mapStyle } from "./style";

type MapLibre = typeof import("maplibre-gl");
type MapInstance = import("maplibre-gl").Map;

export const map = tv({
  slots: {
    root: "relative isolate overflow-hidden rounded-2xl border border-border-default bg-surface-2 shadow-raised",
    canvas: "absolute inset-0 [&_.maplibregl-canvas]:outline-hidden",
    fallback: "absolute inset-0",
    controls: "absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-xl border border-border-default bg-surface-1 shadow-floating",
    control:
      "inline-flex h-10 w-10 items-center justify-center text-lg font-semibold text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:focus-ring-inset disabled:opacity-40 [&+&]:border-t [&+&]:border-border-subtle",
    attribution:
      "absolute bottom-1.5 right-1.5 z-10 rounded-md bg-surface-1/85 px-1.5 py-0.5 text-[10px] text-fg-secondary backdrop-blur-sm [&_a]:underline-offset-2 hover:[&_a]:underline",
    places: "sr-only",
    marker:
      "group relative flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-on-accent bg-accent shadow-floating outline-hidden " +
      "transition-transform hover:scale-110 focus-visible:focus-ring motion-reduce:transition-none motion-reduce:hover:scale-100 data-[selected]:scale-125",
    markerLabel:
      "pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-lg border border-border-default bg-surface-1 px-2 py-1 text-xs font-semibold text-fg shadow-floating",
  },
});

type Registry = { add: (id: string, text: string) => void; remove: (id: string) => void };
type Ctx = { map: MapInstance | null; lib: MapLibre | null; ready: boolean; reduce: boolean; places: Registry };
const MapContext = React.createContext<Ctx | null>(null);

/** The map a child is drawn on (`Marker`, `RadiusCircle`, `Cluster`…): the MapLibre instance once it is ready. */
export function useMap(): Ctx {
  const ctx = React.useContext(MapContext);
  if (!ctx) throw new Error("useMap: inside a <Map> only");
  return ctx;
}

/** The scheme of the page (`html.light`), followed as it changes. */
function usePageScheme(): "dark" | "light" {
  const read = () => (typeof document !== "undefined" && document.documentElement.classList.contains("light") ? "light" : "dark");
  const [scheme, setScheme] = React.useState<"dark" | "light">(read);
  React.useEffect(() => {
    const observer = new MutationObserver(() => setScheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return scheme;
}

let protocolAdded = false;
let workerUrl: string | null = null;

/**
 * Where MapLibre's worker comes from. A bundler (Next.js, Vite) renames MapLibre's module and leaves its worker behind:
 * by default the worker of the very version the app installed is imported from jsDelivr (free, open source, no key)
 * through a module worker of the page's own origin. An app with a strict CSP serves it itself —
 * `configureMaps({ workerUrl: "/maplibre-gl-worker.mjs" })` (with `maplibre-gl-shared.mjs` beside it), once, before a map.
 */
export function configureMaps(options: { workerUrl?: string }) {
  if (options.workerUrl) workerUrl = options.workerUrl;
}

/** MapLibre, its worker and the PMTiles protocol, loaded once for the page. */
async function loadEngine(): Promise<MapLibre> {
  const [lib, pmtiles] = await Promise.all([import("maplibre-gl"), import("pmtiles")]);
  const ml = ((lib as unknown as { default?: MapLibre }).default ?? lib) as MapLibre;
  if (!protocolAdded) {
    protocolAdded = true;
    const remote = `https://cdn.jsdelivr.net/npm/maplibre-gl@${ml.getVersion()}/dist/maplibre-gl-worker.mjs`;
    ml.setWorkerUrl(workerUrl ?? URL.createObjectURL(new Blob([`import ${JSON.stringify(remote)};`], { type: "text/javascript" })));
    ml.addProtocol("pmtiles", new pmtiles.Protocol().tile);
  }
  return ml;
}

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

export type MapLabels = {
  /** The zoom-in button ("Zoom in"). */
  zoomIn: string;
  /** The zoom-out button ("Zoom out"). */
  zoomOut: string;
  /** Before the list of places read in place of the map ("Places on the map"). */
  places: string;
};

export const mapLabels: MapLabels = { zoomIn: "Zoom in", zoomOut: "Zoom out", places: "Places on the map" };

export type MapProps = {
  /** The map's accessible name ("Pick-up points near you"), passed translated. */
  label: string;
  /** Where the map looks at first: longitude, latitude. */
  center: LngLat;
  /** The zoom at first (0 the world, 12 a city, 16 a street). Default 12. */
  zoom?: number;
  /** The camera follows `center` and `zoom` when they change (flies, or jumps under reduced motion). */
  controlled?: boolean;
  /** The scheme. Default: the page's (`html.light`), followed. */
  scheme?: "dark" | "light";
  /** The product whose accent the map carries. Default `krizaka`. */
  brand?: MapBrand;
  /** The language of the labels (`fr`, `en`). Default `en`. */
  lang?: string;
  /** The detailed region (PMTiles) drawn from zoom 6.5. Default: our Montréal–Québec extract (to zoom 14). */
  region?: MapRegion | null;
  /** The world's low zooms (PMTiles). Default: our world extract (to zoom 6). */
  world?: MapRegion | null;
  /** The zoom buttons (default) — the keyboard also zooms with + and − on the focused map. */
  controls?: boolean;
  /** Moves with the hand (default); `false` makes a still picture of a place. */
  interactive?: boolean;
  /** Shown in place of the map while its engine loads, and for good without WebGL: a `StaticMap`, a picture. */
  fallback?: React.ReactNode;
  /** Called when the camera rests: its centre and zoom. */
  onMoveEnd?: (view: { center: LngLat; zoom: number }) => void;
  /** Called with the position pressed on the map (not on a marker). */
  onPress?: (position: LngLat) => void;
  /** Markers, circles, clusters, the user's position — and anything drawn over the map. */
  children?: React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<MapLabels>;
  /** Classes merged on the root (its height: `h-80`, `aspect-video`). */
  className?: string;
};

/** A map: MapLibre over our Protomaps tiles, styled from the tokens, with its places as a list for screen readers. */
export function Map({
  label,
  center,
  zoom = 12,
  controlled,
  scheme: schemeProp,
  brand,
  lang,
  region,
  world,
  controls = true,
  interactive = true,
  fallback,
  onMoveEnd,
  onPress,
  children,
  labels: given,
  className,
}: MapProps) {
  const labels = { ...mapLabels, ...given };
  const s = map();
  const pageScheme = usePageScheme();
  const scheme = schemeProp ?? pageScheme;
  const reduce = usePrefersReducedMotion();
  const host = React.useRef<HTMLDivElement>(null);
  const [instance, setInstance] = React.useState<MapInstance | null>(null);
  const [lib, setLib] = React.useState<MapLibre | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [places, setPlaces] = React.useState<Record<string, string>>({});
  const registry = React.useMemo<Registry>(
    () => ({
      add: (id, text) => setPlaces((p) => (p[id] === text ? p : { ...p, [id]: text })),
      remove: (id) =>
        setPlaces((p) => {
          const { [id]: _gone, ...rest } = p;
          return rest;
        }),
    }),
    [],
  );
  const latest = React.useRef({ onMoveEnd, onPress });
  React.useEffect(() => {
    latest.current = { onMoveEnd, onPress };
  });
  const styleOf = React.useCallback((sc: "dark" | "light") => mapStyle({ scheme: sc, brand, lang, ...(region !== undefined ? { region } : {}), ...(world !== undefined ? { world } : {}) }), [brand, lang, region, world]);

  // The engine and the map, once (the style follows the scheme below).
  React.useEffect(() => {
    if (!host.current) return;
    let alive = true;
    let created: MapInstance | null = null;
    (hasWebGL() ? loadEngine() : Promise.reject(new Error("no WebGL")))
      .then((ml) => {
        if (!alive || !host.current) return;
        created = new ml.Map({
          container: host.current,
          style: styleOf(scheme) as never,
          center: [...center] as [number, number],
          zoom,
          interactive,
          attributionControl: false,
          fadeDuration: reduce ? 0 : 300,
          cooperativeGestures: false,
        });
        created.getCanvas().setAttribute("aria-hidden", "true");
        created.getCanvas().setAttribute("tabindex", "-1");
        created.on("load", () => alive && setReady(true));
        created.on("moveend", () => {
          const c = created!.getCenter();
          latest.current.onMoveEnd?.({ center: [c.lng, c.lat], zoom: created!.getZoom() });
        });
        created.on("click", (e) => {
          if ((e.originalEvent.target as Element | null)?.closest?.("[data-kz-marker]")) return;
          latest.current.onPress?.([e.lngLat.lng, e.lngLat.lat]);
        });
        setLib(ml);
        setInstance(created);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      created?.remove();
    };
    // Created once: the props that change afterwards are followed by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The scheme (and the brand, the language) change the style, not the map.
  const first = React.useRef(true);
  React.useEffect(() => {
    if (!instance) return;
    if (first.current) {
      first.current = false;
      return;
    }
    instance.setStyle(styleOf(scheme) as never);
  }, [instance, scheme, styleOf]);

  // A controlled camera: it flies (or jumps) to the new view.
  React.useEffect(() => {
    if (!instance || !controlled) return;
    const view = { center: [...center] as [number, number], zoom };
    if (reduce) instance.jumpTo(view);
    else instance.flyTo({ ...view, speed: 1.4 });
  }, [instance, controlled, center[0], center[1], zoom, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const zoomBy = (by: number) => instance && (reduce ? instance.setZoom(instance.getZoom() + by) : instance.zoomTo(instance.getZoom() + by, { duration: 250 }));
  const ctx = React.useMemo<Ctx>(() => ({ map: instance, lib, ready, reduce, places: registry }), [instance, lib, ready, reduce, registry]);
  const listed = Object.entries(places);
  return (
    <MapContext.Provider value={ctx}>
      <section
        aria-label={label}
        className={s.root({ className })}
        data-ready={ready ? "" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget || !instance) return;
          if (e.key === "+" || e.key === "=") zoomBy(1);
          else if (e.key === "-") zoomBy(-1);
          else if (e.key.startsWith("Arrow")) {
            e.preventDefault();
            const step = 80;
            const by: Record<string, [number, number]> = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
            instance.panBy(by[e.key]!, { duration: reduce ? 0 : 200 });
          }
        }}
      >
        {!ready || failed ? <div className={s.fallback()}>{fallback}</div> : null}
        <div ref={host} className={s.canvas()} style={{ position: "absolute", inset: 0, visibility: failed ? "hidden" : undefined }} />
        {controls && interactive && !failed ? (
          <div className={s.controls()}>
            <button type="button" className={s.control()} aria-label={labels.zoomIn} disabled={!instance} onClick={() => zoomBy(1)}>
              +
            </button>
            <button type="button" className={s.control()} aria-label={labels.zoomOut} disabled={!instance} onClick={() => zoomBy(-1)}>
              −
            </button>
          </div>
        ) : null}
        <p className={s.attribution()}>
          <a href={MAP_ATTRIBUTION.protomapsUrl} target="_blank" rel="noreferrer">
            {MAP_ATTRIBUTION.protomaps}
          </a>
          {" · "}
          <a href={MAP_ATTRIBUTION.osmUrl} target="_blank" rel="noreferrer">
            {MAP_ATTRIBUTION.osm}
          </a>
        </p>
        {listed.length ? (
          <div className={s.places()}>
            <p>{labels.places}</p>
            <ul>
              {listed.map(([id, text]) => (
                <li key={id}>{text}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {children}
      </section>
    </MapContext.Provider>
  );
}

export type MarkerProps = {
  /** Where it stands. */
  position: LngLat;
  /** Its words: the place's name, read in the list of places and as the button's name ("Café Olimpico, 350 m"). */
  label: string;
  /** Pressing it (details in a panel, a sheet): the marker becomes a button. */
  onPress?: () => void;
  /** The chosen one: larger, its label shown above it. */
  selected?: boolean;
  /** Its size in pixels. Default 18. */
  size?: number;
  /** What it draws instead of the accent dot (an avatar, an icon). */
  children?: React.ReactNode;
};

/** A place on the map: an accent dot (or your content) that is a button when it does something. */
export function Marker({ position, label, onPress, selected, size = 18, children }: MarkerProps) {
  const { map: m, lib, places } = useMap();
  const s = map();
  const id = React.useId();
  const [el] = React.useState(() => (typeof document === "undefined" ? null : document.createElement("div")));
  React.useEffect(() => {
    places.add(id, label);
    return () => places.remove(id);
  }, [id, label, places]);
  React.useEffect(() => {
    if (!m || !lib || !el) return;
    el.setAttribute("data-kz-marker", "");
    const marker = new lib.Marker({ element: el, anchor: "center" }).setLngLat([...position] as [number, number]).addTo(m);
    return () => void marker.remove();
  }, [m, lib, el, position[0], position[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!el) return null;
  const Tag = onPress ? "button" : "span";
  return createPortal(
    <Tag
      type={onPress ? "button" : undefined}
      aria-label={onPress ? label : undefined}
      aria-hidden={onPress ? undefined : true}
      aria-pressed={onPress && selected !== undefined ? selected : undefined}
      data-selected={selected ? "" : undefined}
      className={s.marker()}
      style={children ? undefined : { width: size, height: size }}
      onClick={onPress}
    >
      {children}
      {selected ? <span className={s.markerLabel()}>{label}</span> : null}
    </Tag>,
    el,
  );
}

export type UserPositionProps = {
  /** Where the person is. */
  position: LngLat;
  /** Its words ("You are here"), read in the list of places. */
  label: string;
  /** The accuracy in metres: a soft disc around the dot. */
  accuracy?: number;
};

/** The person's position: a dot that pulses (still under reduced motion), its accuracy as a soft disc. */
export function UserPosition({ position, label, accuracy }: UserPositionProps) {
  const { map: m, lib, places } = useMap();
  const id = React.useId();
  React.useEffect(() => {
    places.add(id, label);
    return () => places.remove(id);
  }, [id, label, places]);
  React.useEffect(() => {
    if (!m || !lib) return;
    const el = document.createElement("div");
    el.className = "kz-map-user";
    el.setAttribute("aria-hidden", "true");
    const marker = new lib.Marker({ element: el, anchor: "center" }).setLngLat([...position] as [number, number]).addTo(m);
    return () => void marker.remove();
  }, [m, lib, position[0], position[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  return accuracy ? <RadiusCircle center={position} radius={accuracy} tone="soft" /> : null;
}

/** Adds a GeoJSON source and its layers while the map has a style (again after a change of scheme). */
function useGeoLayer(id: string, data: GeoJSON.GeoJSON, layers: (palette: ReturnType<typeof mapPalette>) => object[], source: object = {}) {
  const { map: m, ready } = useMap();
  const dataRef = React.useRef(data);
  React.useEffect(() => {
    dataRef.current = data;
    const src = m?.getSource(id) as { setData?: (d: GeoJSON.GeoJSON) => void } | undefined;
    src?.setData?.(data);
  }, [m, id, data]);
  React.useEffect(() => {
    if (!m || !ready) return;
    const add = () => {
      if (m.getSource(id)) return;
      const scheme = document.documentElement.classList.contains("light") ? "light" : "dark";
      m.addSource(id, { type: "geojson", data: dataRef.current, ...source } as never);
      for (const layer of layers(mapPalette(scheme))) m.addLayer(layer as never);
    };
    add();
    m.on("styledata", add);
    return () => {
      m.off("styledata", add);
      if (!m.getStyle()) return;
      for (const layer of m.getStyle().layers.filter((l) => "source" in l && l.source === id)) m.removeLayer(layer.id);
      if (m.getSource(id)) m.removeSource(id);
    };
  }, [m, ready, id]); // eslint-disable-line react-hooks/exhaustive-deps
}

export type RadiusCircleProps = {
  /** Its centre. */
  center: LngLat;
  /** Its radius in metres. */
  radius: number;
  /** `accent` (a zone that matters: a delivery area, a search radius) or `soft` (an accuracy). */
  tone?: "accent" | "soft";
};

/** A circle on the ground: a delivery zone, a search radius — filled with the accent, its edge drawn. */
export function RadiusCircle({ center, radius, tone = "accent" }: RadiusCircleProps) {
  const id = `kz-circle-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const data = React.useMemo(() => circlePolygon(center, radius), [center[0], center[1], radius]); // eslint-disable-line react-hooks/exhaustive-deps
  useGeoLayer(id, data, (c) => [
    { id: `${id}-fill`, type: "fill", source: id, paint: { "fill-color": c.accent, "fill-opacity": tone === "soft" ? 0.1 : 0.14 } },
    { id: `${id}-line`, type: "line", source: id, paint: { "line-color": c.accent, "line-width": tone === "soft" ? 1 : 2, "line-opacity": tone === "soft" ? 0.4 : 0.9, ...(tone === "accent" ? { "line-dasharray": [2, 1.5] } : {}) } },
  ]);
  return null;
}

export type ClusterPoint = { id: string; position: LngLat; label: string };

export type ClusterProps = {
  /** The points: many of them (creators, pick-up points, events). */
  points: readonly ClusterPoint[];
  /** Pressing a single point. A group zooms in to open itself. */
  onPointPress?: (point: ClusterPoint) => void;
  /** The radius, in pixels, within which points group. Default 48. */
  radius?: number;
};

/** Many points grouped while they are close: a disc with the count, opened by zooming in; each point is listed for screen readers. */
export function Cluster({ points, onPointPress, radius = 48 }: ClusterProps) {
  const { map: m, ready, reduce, places } = useMap();
  const id = `kz-cluster-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const data = React.useMemo<GeoJSON.FeatureCollection>(
    () => ({ type: "FeatureCollection", features: points.map((p) => ({ type: "Feature", properties: { id: p.id, label: p.label }, geometry: { type: "Point", coordinates: [...p.position] } })) }),
    [points],
  );
  React.useEffect(() => {
    for (const p of points) places.add(`${id}-${p.id}`, p.label);
    return () => points.forEach((p) => places.remove(`${id}-${p.id}`));
  }, [points, places, id]);
  useGeoLayer(
    id,
    data,
    (c) => [
      { id: `${id}-groups`, type: "circle", source: id, filter: ["has", "point_count"], paint: { "circle-color": c.accent, "circle-opacity": 0.92, "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 50, 26], "circle-stroke-width": 3, "circle-stroke-color": c.halo } },
      { id: `${id}-count`, type: "symbol", source: id, filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Medium"], "text-size": 13 }, paint: { "text-color": c.onAccent } },
      { id: `${id}-points`, type: "circle", source: id, filter: ["!", ["has", "point_count"]], paint: { "circle-color": c.accent, "circle-radius": 7, "circle-stroke-width": 2.5, "circle-stroke-color": c.halo } },
    ],
    { cluster: true, clusterRadius: radius, clusterMaxZoom: 15 },
  );
  React.useEffect(() => {
    if (!m || !ready) return;
    const openGroup = async (e: { features?: { properties: Record<string, unknown>; geometry: GeoJSON.Geometry }[] }) => {
      const f = e.features?.[0];
      if (!f) return;
      const src = m.getSource(id) as unknown as { getClusterExpansionZoom: (id: number) => Promise<number> };
      const z = await src.getClusterExpansionZoom(f.properties.cluster_id as number);
      const center = (f.geometry as GeoJSON.Point).coordinates as [number, number];
      if (reduce) m.jumpTo({ center, zoom: z });
      else m.easeTo({ center, zoom: z });
    };
    const pressPoint = (e: { features?: { properties: Record<string, unknown> }[] }) => {
      const pid = e.features?.[0]?.properties.id;
      const point = points.find((p) => p.id === pid);
      if (point) onPointPress?.(point);
    };
    m.on("click", `${id}-groups`, openGroup as never);
    m.on("click", `${id}-points`, pressPoint as never);
    return () => {
      m.off("click", `${id}-groups`, openGroup as never);
      m.off("click", `${id}-points`, pressPoint as never);
    };
  }, [m, ready, id, points, onPointPress, reduce]);
  return null;
}
