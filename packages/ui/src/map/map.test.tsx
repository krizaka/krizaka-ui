import { readFileSync } from "node:fs";
import { join } from "node:path";

import { themes } from "@krizaka/tokens/native";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { circlePolygon, distanceMeters, formatDistance, LocationPicker, Map, mapPalette, mapStyle, Marker, pathLength, pointAlong, Pulse, REGION_FROM_ZOOM, Route, sliceLine, StaticMap } from "./index";
import { MapPin } from "./pin";

// The engine: a MapLibre stand-in that records what the components ask of it (happy-dom has no WebGL).
const calls: string[] = [];
let lastStyle: unknown;
let lastMap: { sources: Record<string, { data: unknown }> } | undefined;
class FakeMap {
  handlers: Record<string, (() => void)[]> = {};
  zoom = 12;
  constructor(public options: { center: [number, number]; zoom: number }) {
    calls.push(`map ${options.center.join(",")} ${options.zoom}`);
    lastStyle = (options as { style?: unknown }).style;
    this.zoom = options.zoom;
    setTimeout(() => this.handlers.load?.forEach((h) => h()), 0);
  }
  getCanvas() {
    return document.createElement("canvas");
  }
  on(event: string, handler: () => void) {
    (this.handlers[event] ??= []).push(handler);
  }
  off() {}
  remove() {}
  getZoom() {
    return this.zoom;
  }
  getCenter() {
    return { lng: this.options.center[0], lat: this.options.center[1] };
  }
  zoomTo(z: number) {
    calls.push(`zoomTo ${z}`);
    this.zoom = z;
  }
  setZoom(z: number) {
    calls.push(`setZoom ${z}`);
    this.zoom = z;
  }
  jumpTo(v: { center: number[] }) {
    calls.push(`jumpTo ${v.center.join(",")}`);
  }
  flyTo(v: { center: number[] }) {
    calls.push(`flyTo ${v.center.join(",")}`);
  }
  panBy(by: number[]) {
    calls.push(`panBy ${by.join(",")}`);
  }
  setStyle(style: unknown) {
    calls.push("setStyle");
    lastStyle = style;
  }
  sources: Record<string, { data: unknown; setData: (d: unknown) => void }> = {};
  getContainer() {
    return document.body;
  }
  getSource(id: string) {
    return this.sources[id];
  }
  getStyle() {
    return { layers: [] };
  }
  addSource(id: string, source: { data: unknown }) {
    const entry = { data: source.data, setData: (d: unknown) => void (entry.data = d) };
    this.sources[id] = entry;
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- the test reads the sources of the map the component drew on
    lastMap = this;
  }
  addLayer() {}
  removeLayer() {}
  removeSource(id: string) {
    delete this.sources[id];
  }
}
class FakeMarker {
  constructor(public options: { element: HTMLElement }) {}
  setLngLat() {
    return this;
  }
  addTo() {
    document.body.appendChild(this.options.element);
    return this;
  }
  remove() {
    this.options.element.remove();
  }
}
vi.mock("maplibre-gl", () => ({ default: { Map: FakeMap, Marker: FakeMarker, addProtocol: () => calls.push("protocol"), getVersion: () => "6.11.2", setWorkerUrl: (u: string) => calls.push(`worker ${u.slice(0, 5)}`) } }));
vi.mock("pmtiles", () => ({ Protocol: class { tile = () => undefined; } }));

const withWebGL = () => vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as never);

describe("the style, from the tokens", () => {
  it("draws the world's low zooms, then the region from zoom 6.5, in the scheme's colours and the brand's accent", () => {
    const style = mapStyle({ scheme: "dark" });
    expect(Object.keys(style.sources)).toEqual(["world", "region"]);
    expect((style.sources.region as { url: string }).url).toMatch(/^pmtiles:\/\/https:\/\/krizaka-assets\.b-cdn\.net\/maps\/v1\/tiles\/quebec-\d{8}\.pmtiles$/);
    expect(style.layers.filter((l) => l.id.startsWith("region-")).every((l) => (l.minzoom ?? 0) >= REGION_FROM_ZOOM)).toBe(true);
    expect(style.layers.filter((l) => l.id.startsWith("world-")).every((l) => (l.maxzoom ?? 24) <= REGION_FROM_ZOOM)).toBe(true);
    expect(style.glyphs).toContain("{fontstack}/{range}.pbf");
    expect(JSON.stringify(style.layers)).not.toMatch(/icon-image/);
    expect(mapPalette("dark").land).not.toBe(mapPalette("light").land);
    expect(mapPalette("dark", "yomizaka").accent).toBe("#8888f2");
  });

  it("the notebook variant is the Cahier's paper and ink, drawn from the tokens in both schemes", () => {
    for (const scheme of ["light", "dark"] as const) {
      const plain = mapPalette(scheme);
      const nb = mapPalette(scheme, "krizaka", "notebook");
      const colours = [nb.land, nb.water, nb.park, nb.road, nb.roadMajor, nb.building, nb.cluster.fill, nb.cluster.stroke, nb.cluster.text, nb.point.fill];
      expect(colours.every((c) => /^#[0-9a-f]{6}$/.test(c))).toBe(true);
      expect(nb.land).toBe(themes[scheme].surface0); // the paper (light) or the slate (dark)
      expect(nb.cluster.fill).toBe(themes[scheme].paperTag); // a cluster is a manila tag
      expect(nb.point.fill).toBe(themes[scheme].paperRuleMargin); // a single place is the margin's red
      expect(nb.casing).toBe(nb.land); // no casings: lines as drawn with a pen
      expect(nb.roadMajor).not.toBe(plain.roadMajor);
      expect(plain.cluster.fill).toBe(plain.accent); // the product register keeps the accent disc
    }
    expect(mapPalette("light", "krizaka", "notebook").land).not.toBe(mapPalette("dark", "krizaka", "notebook").land);
  });

  it("the muted variant draws the colours back, and a variant reaches the style", () => {
    const plain = mapPalette("light");
    const muted = mapPalette("light", "krizaka", "muted");
    expect(muted.water).not.toBe(plain.water);
    expect(muted.label).not.toBe(plain.label);
    expect(JSON.stringify(mapStyle({ scheme: "light", variant: "notebook" }))).not.toBe(JSON.stringify(mapStyle({ scheme: "light" })));
    expect(JSON.stringify(mapStyle({ scheme: "light", variant: "plain" }))).toBe(JSON.stringify(mapStyle({ scheme: "light" })));
    const bg = (v: Parameters<typeof mapStyle>[0]["variant"]) => (mapStyle({ scheme: "dark", variant: v }).layers.find((l) => l.id === "background") as unknown as { paint: Record<string, string> }).paint["background-color"];
    expect(bg("notebook")).toBe(mapPalette("dark", "krizaka", "notebook").background);
  });

  it("measures distances and draws circles", () => {
    expect(Math.round(distanceMeters([-73.5673, 45.5017], [-71.208, 46.8139]) / 1000)).toBe(233);
    const ring = circlePolygon([-73.5, 45.5], 1000).geometry.coordinates[0]!;
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(Math.round(distanceMeters([-73.5, 45.5], ring[10] as [number, number]))).toBe(1000);
    expect(formatDistance(1234, "en-CA")).toBe("1.2 km");
    expect(formatDistance(420, "fr-CA")).toMatch(/^420\sm$/);
  });
});

describe("StaticMap", () => {
  it("is an image named by its places", async () => {
    const { container } = render(<StaticMap label="Pick-up points" center={[-73.58, 45.52]} places={[{ position: [-73.6, 45.52], label: "Café Olimpico" }]} />);
    expect(screen.getByRole("img", { name: "Pick-up points: Café Olimpico" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("Map", () => {
  it("without WebGL: the fallback stays, the attribution shows, the places are a list", async () => {
    render(
      <Map label="Pick-up points" center={[-73.58, 45.52]} fallback={<StaticMap label="Pick-up points (picture)" center={[-73.58, 45.52]} />}>
        <Marker position={[-73.6, 45.52]} label="Café Olimpico" />
      </Map>,
    );
    expect(screen.getByRole("region", { name: "Pick-up points" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Pick-up points (picture)" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "© OpenStreetMap contributors" }).getAttribute("href")).toBe("https://www.openstreetmap.org/copyright");
    expect(await screen.findByText("Café Olimpico")).toBeTruthy();
  });

  it("with the engine: markers are buttons, the zoom buttons and the keys move the camera", async () => {
    const webgl = withWebGL();
    calls.length = 0;
    const user = userEvent.setup();
    const pressed = vi.fn();
    render(
      <Map label="Pick-up points" center={[-73.58, 45.52]} zoom={12}>
        <Marker position={[-73.6, 45.52]} label="Café Olimpico" onPress={pressed} selected={false} />
      </Map>,
    );
    await waitFor(() => expect(calls).toContain("map -73.58,45.52 12"));
    expect(calls).toContain("protocol");
    expect(calls).toContain("worker blob:");
    const marker = await screen.findByRole("button", { name: "Café Olimpico" });
    expect(marker.getAttribute("aria-pressed")).toBe("false");
    await user.click(marker);
    expect(pressed).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(calls.some((c) => c.startsWith("zoomTo 13") || c.startsWith("setZoom 13"))).toBe(true);
    screen.getByRole("region", { name: "Pick-up points" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(calls).toContain("panBy 80,0");
    webgl.mockRestore();
  });
});

describe("LocationPicker", () => {
  it("asks for the position only when Near me is pressed, then shows the distance; a refusal has its words", async () => {
    const webgl = withWebGL();
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    let answer: "yes" | "no" = "no";
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (ok: (p: unknown) => void, ko: (e: unknown) => void) =>
          answer === "yes" ? ok({ coords: { longitude: -73.5794, latitude: 45.5048 } }) : ko({ code: 1 }),
      },
    });
    const { rerender } = render(<LocationPicker label="Meeting point" locale="en-CA" value={[-73.5673, 45.5017]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Near me" }));
    expect(await screen.findByText("Location is off for this site. Move the map instead.")).toBeTruthy();
    answer = "yes";
    await user.click(screen.getByRole("button", { name: "Near me" }));
    expect(onValueChange).toHaveBeenLastCalledWith([-73.5794, 45.5048]);
    await act(async () => rerender(<LocationPicker label="Meeting point" locale="en-CA" value={[-73.5673, 45.5017]} onValueChange={onValueChange} />));
    expect(screen.getByText("1 km from you")).toBeTruthy();
    webgl.mockRestore();
  });
});

describe("the assets' base", () => {
  it("reads the tiles and glyphs through a same-origin proxy when one is set", async () => {
    const { setMapAssetsBase } = await import("./index");
    setMapAssetsBase("https://www.krizaka.com/maps/v1");
    const style = mapStyle({ scheme: "light" });
    expect((style.sources.world as { url: string }).url).toMatch(/^pmtiles:\/\/https:\/\/www\.krizaka\.com\/maps\/v1\/tiles\/world-/);
    expect(style.glyphs).toBe("https://www.krizaka.com/maps/v1/fonts/{fontstack}/{range}.pbf");
    setMapAssetsBase(null);
    expect(mapStyle({ scheme: "light" }).glyphs).toContain("b-cdn.net");
  });
});

describe("MapPin", () => {
  const html = (p: Parameters<typeof MapPin>[0]) => renderToString(<MapPin {...p} />);
  it("draws three shapes from the tokens, never a hard-coded colour", () => {
    for (const shape of ["drop", "disc", "tag"] as const) {
      const out = html({ shape });
      expect(out).toContain(`data-shape="${shape}"`);
      expect(out).toContain("aria-hidden");
      expect(out).not.toMatch(/#[0-9a-f]{3,6}\b|rgb\(/i);
    }
    expect(html({ shape: "tag" })).toContain("--kz-paper-tag");
    expect(html({ tone: "margin" })).toContain("--kz-paper-rule-margin");
  });
  it("says its state by shape as well as by colour: hollow when visited, dashed when closed, larger when selected", () => {
    expect(html({ state: "default" })).not.toContain("stroke-dasharray");
    expect(html({ state: "closed" })).toContain("stroke-dasharray");
    expect(html({ state: "visited" })).toContain("var(--kz-surface-1)");
    expect(html({ state: "selected" })).toContain("scale-125");
    expect(html({ state: "closed" })).toContain("--kz-text-muted");
  });
  it("sits in a Marker without changing its accessible name", async () => {
    const webgl = withWebGL();
    const { container } = render(
      <Map label="Places" center={[-73.58, 45.52]}>
        <Marker position={[-73.6, 45.52]} label="Atelier Rose" onPress={() => undefined}>
          <MapPin shape="tag" state="selected">3</MapPin>
        </Marker>
      </Map>,
    );
    expect(await screen.findByRole("button", { name: "Atelier Rose" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
    webgl.mockRestore();
  });
});

describe("hydration", () => {
  it("a Marker is the same on the server and on the first client render: the page's HTML is kept, no mismatch", async () => {
    const app = (
      <Map label="Pick-up points" center={[-73.59, 45.52]} zoom={12} fallback={<StaticMap label="Pick-up points" center={[-73.59, 45.52]} places={[]} />}>
        <Marker position={[-73.6, 45.52]} label="Café Olimpico" onPress={() => undefined} selected />
      </Map>
    );
    // The server has no document: render to a string the way Next.js does, then restore the browser before hydrating.
    const document_ = globalThis.document;
    vi.stubGlobal("document", undefined);
    let html: string;
    try {
      html = renderToString(app);
    } finally {
      vi.stubGlobal("document", document_);
    }
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors: unknown[] = [];
    const root = hydrateRoot(container, app, { onRecoverableError: (error) => errors.push(error) });
    await act(async () => undefined);
    expect(errors, "a hydration mismatch is a recoverable error").toEqual([]);
    root.unmount();
    container.remove();
  });
});

describe("geometry of a route", () => {
  const path = [[-73.6, 45.5], [-73.6, 45.52], [-73.56, 45.52]] as const;
  it("measures a path, finds the point at a fraction with its heading, and slices the first part as a line", () => {
    const total = pathLength(path);
    expect(total).toBeGreaterThan(3000);
    expect(pointAlong(path, 0).position).toEqual([-73.6, 45.5]);
    expect(pointAlong(path, 1).position).toEqual([-73.56, 45.52]);
    expect(pointAlong(path, 0.1).heading).toBe(0); // heading north on the first leg
    expect(Math.round(pointAlong(path, 0.99).heading)).toBe(90); // then east
    expect(pointAlong(path, 2).position).toEqual([-73.56, 45.52]); // clamped
    const half = sliceLine(path, 0.5).geometry.coordinates;
    expect(half[0]).toEqual([-73.6, 45.5]);
    expect(pathLength(half as never)).toBeCloseTo(total / 2, -1);
    expect(sliceLine(path, 1).geometry.coordinates).toEqual(path.map((p) => [...p]));
    expect(sliceLine(path, 0).geometry.coordinates).toHaveLength(2); // a line needs two points: a dot
  });
});

describe("Route, Pulse and Marker drop", () => {
  const route = [[-73.6, 45.5], [-73.58, 45.52], [-73.56, 45.51]] as const;
  const reduced = (on: boolean) => vi.stubGlobal("matchMedia", (query: string) => ({ matches: on && query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));
  afterEach(() => vi.unstubAllGlobals());

  it("draws the route over its duration, from nothing to the whole line, then stops (a finite animation)", async () => {
    const webgl = withWebGL();
    reduced(false);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    vi.stubGlobal("IntersectionObserver", class { constructor(private cb: IntersectionObserverCallback) { setTimeout(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never), 0); } observe() {} disconnect() {} });
    render(
      <Map label="Delivery" center={[-73.58, 45.51]}>
        <Route path={route} label="Delivery from the studio to Mile End, 3 km" duration={1000} />
      </Map>,
    );
    expect(await screen.findByText("Delivery from the studio to Mile End, 3 km")).toBeTruthy();
    const source = () => Object.values(lastMap!.sources)[0]!.data as GeoJSON.Feature<GeoJSON.LineString>;
    await waitFor(() => expect(frames.length).toBeGreaterThan(0));
    expect(source().geometry.coordinates).toHaveLength(2); // starts as a dot
    const now = performance.now();
    await act(async () => frames.shift()!(now + 500)); // halfway
    expect(pathLength(source().geometry.coordinates as never)).toBeGreaterThan(0);
    expect(pathLength(source().geometry.coordinates as never)).toBeLessThan(pathLength(route));
    await act(async () => { while (frames.length) frames.shift()!(now + 1200); });
    expect(source().geometry.coordinates).toEqual(route.map((p) => [...p])); // whole
    expect(frames).toHaveLength(0); // nothing keeps running
    webgl.mockRestore();
  });

  it("under reduced motion the line is whole at once and the courier rests at the end, no frame asked", async () => {
    const webgl = withWebGL();
    reduced(true);
    const raf = vi.fn(() => 0);
    vi.stubGlobal("requestAnimationFrame", raf);
    render(
      <Map label="Delivery" center={[-73.58, 45.51]}>
        <Route path={route} label="Delivery" courier />
      </Map>,
    );
    await waitFor(() => expect(lastMap && Object.keys(lastMap.sources).length).toBeGreaterThan(0));
    expect((Object.values(lastMap!.sources)[0]!.data as GeoJSON.Feature<GeoJSON.LineString>).geometry.coordinates).toEqual(route.map((p) => [...p]));
    await waitFor(() => expect(document.querySelector(".kz-map-courier")).toBeTruthy());
    expect(raf).not.toHaveBeenCalled();
    webgl.mockRestore();
  });

  it("a Pulse is a decorative element read in the list of places; a Marker with `drop` carries its delay", async () => {
    const webgl = withWebGL();
    reduced(false);
    render(
      <Map label="Demand" center={[-73.58, 45.51]}>
        <Pulse position={[-73.58, 45.51]} label="High demand in Mile End" size={64} />
        <Marker position={[-73.6, 45.5]} label="Studio" drop={180} />
      </Map>,
    );
    expect(await screen.findByText("High demand in Mile End")).toBeTruthy();
    await waitFor(() => expect(document.querySelector(".kz-map-pulse")?.getAttribute("aria-hidden")).toBe("true"));
    expect((document.querySelector(".kz-map-pulse") as HTMLElement).style.getPropertyValue("--kz-map-pulse-size")).toBe("64px");
    await waitFor(() => expect((document.querySelector("[data-kz-marker] > [data-drop]") as HTMLElement | null)?.style.getPropertyValue("--kz-map-drop-delay")).toBe("180ms"));
    const css = readFileSync(join(import.meta.dirname, "../motion.css"), "utf8");
    expect(css).toMatch(/\.kz-map-pulse::before, \.kz-map-pulse::after \{ animation: none !important; \}|\[data-drop\], \.kz-map-pulse::before, \.kz-map-pulse::after \{ animation: none !important; \}/);
    webgl.mockRestore();
  });
});

describe("Map follows the page's scheme", () => {
  it("a theme that changes before the engine has loaded (the provider flips `html.light` after mount) still ends on the light style", async () => {
    const webgl = withWebGL();
    document.documentElement.classList.remove("light");
    render(<Map label="Places" center={[-73.58, 45.52]} />);
    document.documentElement.classList.add("light"); // before the engine's dynamic import resolves
    await waitFor(() => expect(calls).toContain("map -73.58,45.52 12"));
    await waitFor(() => expect(JSON.stringify(lastStyle)).toBe(JSON.stringify(mapStyle({ scheme: "light" }))));
    document.documentElement.classList.remove("light");
    await waitFor(() => expect(JSON.stringify(lastStyle)).toBe(JSON.stringify(mapStyle({ scheme: "dark" }))));
    webgl.mockRestore();
  });

  it("`scheme=\"auto\"` follows the page, a pinned scheme does not, and a variant is worn", async () => {
    const webgl = withWebGL();
    document.documentElement.classList.remove("light");
    const { unmount } = render(<Map label="Places" center={[-73.58, 45.52]} scheme="auto" variant="notebook" />);
    await waitFor(() => expect(JSON.stringify(lastStyle)).toBe(JSON.stringify(mapStyle({ scheme: "dark", variant: "notebook" }))));
    document.documentElement.classList.add("light");
    await waitFor(() => expect(JSON.stringify(lastStyle)).toBe(JSON.stringify(mapStyle({ scheme: "light", variant: "notebook" }))));
    unmount();
    render(<Map label="Pinned" center={[-73.58, 45.52]} scheme="dark" />);
    await waitFor(() => expect(JSON.stringify(lastStyle)).toBe(JSON.stringify(mapStyle({ scheme: "dark" }))));
    document.documentElement.classList.remove("light");
    webgl.mockRestore();
  });

  it("config vocabulary: `easing` shapes the drawing (linear is half the line at half the time) and `paused` holds every frame", async () => {
    const webgl = withWebGL();
    const route = [[-73.6, 45.5], [-73.58, 45.52], [-73.56, 45.51]] as const;
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    vi.stubGlobal("IntersectionObserver", class { constructor(private cb: IntersectionObserverCallback) { setTimeout(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never), 0); } observe() {} disconnect() {} });
    const el = (paused: boolean) => (
      <Map label="Delivery" center={[-73.58, 45.51]}>
        <Route path={route} label="Delivery" duration={1000} easing="linear" paused={paused} />
      </Map>
    );
    const { rerender } = render(el(true));
    await waitFor(() => expect(lastMap && Object.keys(lastMap.sources).length).toBeGreaterThan(0));
    await act(async () => new Promise((r) => setTimeout(r, 30)));
    expect(frames).toHaveLength(0); // paused: no frame is asked
    rerender(el(false));
    await waitFor(() => expect(frames.length).toBeGreaterThan(0));
    const now = performance.now();
    await act(async () => frames.shift()!(now + 500));
    const source = Object.values(lastMap!.sources)[0]!.data as GeoJSON.Feature<GeoJSON.LineString>;
    expect(pathLength(source.geometry.coordinates as never) / pathLength(route)).toBeCloseTo(0.5, 1);
    vi.unstubAllGlobals();
    webgl.mockRestore();
  });
});
