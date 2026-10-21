"use client";

import { type ComponentType, lazy, type MouseEvent, Suspense, type SyntheticEvent, useEffect, useRef, useState } from "react";

import { staysInPlace } from "@/lib/sample-links";
import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES } from "@/lib/ui-examples";

/* A named example of the registry, in the static HTML and brought to life when it nears the screen.
   - On the server it renders the example (React.lazy: the server waits for it), so the page's HTML holds it.
   - In the browser that HTML is kept as it is and not hydrated: the wrapper hydrates as an empty
     `dangerouslySetInnerHTML` (React leaves the server's markup alone), so no example costs anything at load — no
     Suspense boundary, no lazy, no code. A page of 27 examples hydrated them all at once in one long task before.
   - When the example nears the screen its code is fetched, then the live component replaces the markup in one commit.
   A client component on purpose: a Server Component that imported the examples map would put all of them (≈ 490
   modules) in its route's client code (tests/route-weight.test.mjs). The wrapper is `display: contents`: it adds no box. */

type AnyExample = ComponentType<Record<string, unknown>>;

// The server's renderers: one lazy wrapper per example, made once.
const ON_SERVER = typeof window === "undefined";
const SERVER_EXAMPLES = ON_SERVER
  ? (Object.fromEntries(Object.entries(UI_EXAMPLES).map(([key, load]) => [key, lazy(async () => ({ default: (await load()).default as AnyExample }))])) as Partial<Record<string, AnyExample>>)
  : {};

/* An example's links and forms are samples (lib/sample-links.ts): a click on one, or Enter in a field of one, goes
   nowhere. Captured on the wrapper, so it holds before and after the live component replaces the markup. */
function keepSamplesInPlace(event: SyntheticEvent) {
  const target = event.target instanceof Element ? event.target : null;
  if (event.type === "click") {
    const href = target?.closest("a[href]")?.getAttribute("href");
    if (href !== undefined && href !== null && staysInPlace(href, window.location.origin)) (event as MouseEvent).preventDefault();
  } else if (event.type === "submit") {
    const action = (target?.closest("form") ?? null)?.getAttribute("action") ?? null;
    if (staysInPlace(action, window.location.origin)) event.preventDefault();
  }
}

export function LiveExample({ exampleKey }: { exampleKey: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [Live, setLive] = useState<AnyExample | null>(null);

  useEffect(() => {
    const frame = host.current?.parentElement;
    const load = UI_EXAMPLES[exampleKey as keyof typeof UI_EXAMPLES];
    if (!load) return;
    let alive = true;
    const wake = () => void load().then((module) => alive && setLive(() => module.default as AnyExample));
    if (!frame || typeof IntersectionObserver === "undefined") {
      wake();
      return () => {
        alive = false;
      };
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        wake();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(frame);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [exampleKey]);

  if (ON_SERVER) {
    const Example = SERVER_EXAMPLES[exampleKey];
    if (!Example) return null;
    return (
      <div ref={host} className="kz-live-example">
        <Suspense fallback={null}>
          <Example {...examplePropsOf(exampleKey)} />
        </Suspense>
      </div>
    );
  }
  if (Live) {
    return (
      <div ref={host} className="kz-live-example" onClickCapture={keepSamplesInPlace} onSubmitCapture={keepSamplesInPlace}>
        <Live {...examplePropsOf(exampleKey)} />
      </div>
    );
  }
  // Hydrates over the server's markup without touching it (the example stays as rendered until it wakes up).
  return <div ref={host} className="kz-live-example" onClickCapture={keepSamplesInPlace} onSubmitCapture={keepSamplesInPlace} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
}
