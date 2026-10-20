"use client";

import { type ComponentType, lazy, Suspense, useEffect, useRef } from "react";

import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES } from "@/lib/ui-examples";

/* A named example of the registry, rendered where it stands — in the static HTML like before (the server waits for it) —
   and brought to life when it nears the screen: its code is a chunk of its own, fetched then, so a page of twenty examples
   does not hydrate them all in one long task. A client component on purpose: a Server Component that imported the
   examples map would put all of them (≈ 490 modules) in its route's client code; here each `import()` is a lazy chunk,
   fetched only by the pages that show it (tests/route-weight.test.mjs). Until then the server's HTML stays on screen. */

type AnyExample = ComponentType<Record<string, unknown>>;

/** One gate per example: open on the server (it renders at once), opened in the browser when the example nears the screen. */
const gates = new Map<string, { opened: Promise<void>; open: () => void }>();
function gate(key: string) {
  let g = gates.get(key);
  if (!g) {
    let open = () => {};
    const opened = typeof window === "undefined" ? Promise.resolve() : new Promise<void>((resolve) => (open = resolve));
    g = { opened, open };
    gates.set(key, g);
  }
  return g;
}

// One lazy wrapper per example, made once: nothing is fetched until its gate opens.
const EXAMPLES = Object.fromEntries(
  Object.entries(UI_EXAMPLES).map(([key, load]) => [
    key,
    lazy(async () => {
      await gate(key).opened;
      return { default: (await load()).default as AnyExample };
    }),
  ]),
) as Partial<Record<string, AnyExample>>;

export function LiveExample({ exampleKey }: { exampleKey: string }) {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const frame = marker.current?.parentElement;
    const { open } = gate(exampleKey);
    if (!frame || typeof IntersectionObserver === "undefined") return open();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        open();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [exampleKey]);

  const Example = EXAMPLES[exampleKey];
  if (!Example) return null;
  return (
    <>
      {/* Where the example stands: its frame is what the observer watches (a hidden marker adds no box). */}
      <span ref={marker} hidden />
      <Suspense fallback={null}>
        <Example {...examplePropsOf(exampleKey)} />
      </Suspense>
    </>
  );
}
