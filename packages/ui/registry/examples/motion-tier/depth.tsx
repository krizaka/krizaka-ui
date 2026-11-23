"use client";

import { DepthField, useMotionTier } from "@krizaka/ui/motion-tier";

// Layers that follow the pointer, and the tier this device affords: full, light (a weak device, Save-Data) or still.
export default function MotionTierDepth() {
  const tier = useMotionTier();
  return (
    <DepthField className="kz-pp-hero p-10">
      <span className="kz-pp-l kz-pp-l-grid" aria-hidden />
      <span className="kz-pp-l kz-pp-l-light" aria-hidden />
      <p className="relative text-lg text-fg">
        Motion tier: <strong>{tier}</strong>
      </p>
    </DepthField>
  );
}
