import type { Meta, StoryObj } from "@storybook/react-vite";

import CompactExample from "../../registry/examples/engine-flow/compact";
import RadialExample from "../../registry/examples/engine-flow/radial";
import { EngineFlow } from "./engine-flow";

/** An engine at the hub and the apps it serves. Each story renders a named example of the registry. */
const meta = {
  title: "Primitives/EngineFlow",
  component: EngineFlow,
  args: { label: "Orazaka and the products it powers", hub: { label: "Orazaka" }, nodes: [] },
} satisfies Meta<typeof EngineFlow>;
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Real-browser proof that the photons travel and the engine breathes (krizaka-ui: they sat still on every site because
 * the keyframes' number was not interpolable with a length). Samples the visible stage's dash offsets over ~700 ms.
 * Under reduced motion the figure must stay still instead.
 */
const moves: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const stage = [...canvasElement.querySelectorAll<HTMLElement>(".kz-flow-stage")].find((el) => el.getClientRects().length > 0);
  if (!stage) throw new Error("no visible EngineFlow stage");
  const photons = [...stage.querySelectorAll<SVGElement>(".kz-flow-photon:not([data-halo])")];
  if (photons.length === 0) throw new Error("no photon drawn");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // One photon's own readings: interpolated, they are many distinct finite lengths; the bug gave two (`0px` and a `calc()`).
  const seen = photons.map(() => new Set<string>());
  for (let i = 0; i < 7; i++) {
    photons.forEach((p, k) => seen[k]!.add(getComputedStyle(p).strokeDashoffset));
    await new Promise((resolve) => setTimeout(resolve, 110));
  }
  const readings = seen.map((set) => [...set]);
  const finite = readings.every((r) => r.every((v) => /^-?[\d.]+(px)?$/.test(v)));
  const distinct = Math.min(...readings.map((r) => r.length));
  const hub = stage.querySelector<HTMLElement>(".kz-flow-hub-mark");
  const running = photons.every((p) => p.getAnimations().some((a) => a.playState === "running"));
  if (reduce) {
    if (distinct !== 1) throw new Error("photons move under reduced motion");
  } else {
    if (!finite) throw new Error("the dash offset is not an interpolated length");
    if (distinct < 4) throw new Error(`photons do not travel (${distinct} distinct positions in 700 ms)`);
    if (!running) throw new Error("a photon animation is not running");
    if (hub && getComputedStyle(hub).animationName === "none") throw new Error("the hub does not breathe");
  }
};

export const Radial: Story = { render: () => <RadialExample />, play: moves };
export const Compact: Story = { render: () => <CompactExample />, play: moves };
