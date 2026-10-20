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
 * the keyframes' number was not interpolable with a length). Samples the visible stage's dash offsets over ~600 ms.
 * Under reduced motion the figure must stay still instead.
 */
const moves: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const stage = [...canvasElement.querySelectorAll<HTMLElement>(".kz-flow-stage")].find((el) => el.getClientRects().length > 0);
  if (!stage) throw new Error("no visible EngineFlow stage");
  const photons = [...stage.querySelectorAll<SVGElement>(".kz-flow-photon:not([data-halo])")];
  if (photons.length === 0) throw new Error("no photon drawn");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const read = () => photons.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
  const seen = new Set<string>();
  for (let i = 0; i < 6; i++) {
    seen.add(read().map((v) => v.toFixed(2)).join(","));
    await new Promise((resolve) => setTimeout(resolve, 110));
  }
  const hub = stage.querySelector<HTMLElement>(".kz-flow-hub-mark");
  const running = photons.every((p) => p.getAnimations().some((a) => a.playState === "running"));
  if (reduce) {
    if (seen.size !== 1) throw new Error("photons move under reduced motion");
  } else {
    if (seen.size < 4) throw new Error(`photons do not travel (${seen.size} distinct positions in 600 ms)`);
    if (!running) throw new Error("a photon animation is not running");
    if (hub && getComputedStyle(hub).animationName === "none") throw new Error("the hub does not breathe");
  }
};

export const Radial: Story = { render: () => <RadialExample />, play: moves };
export const Compact: Story = { render: () => <CompactExample />, play: moves };
