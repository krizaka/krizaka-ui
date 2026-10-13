import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { circlePolygon, distanceMeters, formatDistance, LocationPicker, Map, mapPalette, mapStyle, Marker, REGION_FROM_ZOOM, StaticMap } from "./index";

// The engine: a MapLibre stand-in that records what the components ask of it (happy-dom has no WebGL).
const calls: string[] = [];
class FakeMap {
  handlers: Record<string, (() => void)[]> = {};
  zoom = 12;
  constructor(public options: { center: [number, number]; zoom: number }) {
    calls.push(`map ${options.center.join(",")} ${options.zoom}`);
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
  setStyle() {
    calls.push("setStyle");
  }
  getSource() {
    return undefined;
  }
  getStyle() {
    return { layers: [] };
  }
  addSource() {}
  addLayer() {}
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
vi.mock("maplibre-gl", () => ({ default: { Map: FakeMap, Marker: FakeMarker, addProtocol: () => calls.push("protocol") } }));
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
    expect(mapPalette("dark", "orochia").accent).toBe("#7c3aed");
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
