"use client";
// The world the maps draw: Natural Earth 1:110m countries (public domain) through world-atlas, keyed by ISO 3166-1
// alpha-2 (scripts/world.mjs). ~38 kB gzipped, loaded on demand — only by GeoMap and Globe3D, once per page.
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useEffect, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

export type Country = Omit<Feature<Geometry, { name: string }>, "id"> & { id?: string };
export type World = Omit<FeatureCollection<Geometry, { name: string }>, "features"> & { features: Country[] };

let world: Promise<World> | null = null;

/** The countries, decoded once (a lazy chunk of the package). */
export function loadWorld(): Promise<World> {
  world ??= import("./world-110m.json").then((module) => {
    const topology = (module.default ?? module) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
    return feature(topology, topology.objects.countries) as unknown as World;
  });
  return world;
}

/** The world once loaded (null before, or when `enabled` is false); an error leaves it null and says so. */
export function useWorld(enabled: boolean): { world: World | null; failed: boolean } {
  const [state, setState] = useState<{ world: World | null; failed: boolean }>({ world: null, failed: false });
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    loadWorld().then(
      (w) => alive && setState({ world: w, failed: false }),
      () => alive && setState({ world: null, failed: true }),
    );
    return () => {
      alive = false;
    };
  }, [enabled]);
  return state;
}

const displayNames = new Map<string, Intl.DisplayNames>();

/** A region's name in the reader's language (`Intl.DisplayNames`), else Natural Earth's English one. */
export function regionName(code: string | undefined, fallback: string, locale: string | readonly string[]): string {
  if (!code) return fallback;
  try {
    const key = String(locale);
    let names = displayNames.get(key);
    if (!names) {
      names = new Intl.DisplayNames(locale as string[], { type: "region" });
      displayNames.set(key, names);
    }
    return names.of(code) ?? fallback;
  } catch {
    return fallback;
  }
}
