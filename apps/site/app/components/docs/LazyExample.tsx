"use client";

import { Component, type ComponentType, lazy, type ReactNode, Suspense, useEffect, useRef, useState } from "react";

import { mapSnapshotOf } from "@/lib/map-gate";
import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES } from "@/lib/ui-examples";

import { MapGate } from "./MapGate";

/* A named example of the registry, loaded when it scrolls into view: the catalogue shows 150 of them and ships none of
   their code until a card is near the screen. The heavy ones (maps, charts, media, whole pages) wait a moment more, once
   the page has settled. Static first: until it is loaded the card shows its placeholder, and a failure leaves it there. */
/* One lazy component per example, made once at load: the module is fetched when the card first renders it, in a Suspense. */
const LAZY_EXAMPLES = Object.fromEntries(
  Object.entries(UI_EXAMPLES).map(([key, load]) => [key, lazy(async () => ({ default: (await load()).default as ComponentType<Record<string, unknown>> }))]),
) as Record<string, ComponentType<Record<string, unknown>>>;

class Guard extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function LazyExample({ exampleKey, heavy, placeholder }: { exampleKey: string; heavy: boolean; placeholder: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const snapshot = mapSnapshotOf(exampleKey);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        // The heavy ones wait for the page to settle: the first screen is painted before anything expensive starts.
        timer = setTimeout(() => setWanted(true), heavy ? 700 : 0);
      },
      { rootMargin: heavy ? "0px" : "240px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [heavy]);

  const Example = wanted ? LAZY_EXAMPLES[exampleKey] : undefined;

  return (
    <div ref={host} className="kz-catalog-live" inert>
      {Example ? (
        <Guard fallback={placeholder}>
          <Suspense fallback={placeholder}>
            {snapshot ? (
              <MapGate snapshot={snapshot} alt="">
                <Example {...examplePropsOf(exampleKey)} />
              </MapGate>
            ) : (
              <Example {...examplePropsOf(exampleKey)} />
            )}
          </Suspense>
        </Guard>
      ) : (
        placeholder
      )}
    </div>
  );
}
