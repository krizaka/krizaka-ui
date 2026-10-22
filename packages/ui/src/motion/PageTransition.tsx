import type { ComponentType, ReactNode } from "react";
import * as React from "react";

/** The `view-transition-class` the page change carries (styled in motion.css, « PAGE TRANSITIONS »). */
export const PAGE_TRANSITION_CLASS = "kz-page";

type ViewTransitionComponent = ComponentType<{ children?: ReactNode; default?: string }>;

/** Next.js ships React canary, where it is `ViewTransition`; earlier canaries called it `unstable_ViewTransition`. */
const RUNTIME_KEYS = ["ViewTransition", "unstable_ViewTransition"] as const;

// Read through a variable key: a plain React build has neither export, and a static `React.ViewTransition` would make
// the bundler warn about a missing export.
function runtimeViewTransition(): ViewTransitionComponent | undefined {
  const runtime = React as unknown as Record<string, ViewTransitionComponent | undefined>;
  return RUNTIME_KEYS.map((key) => runtime[key]).find(Boolean);
}

const ViewTransition = runtimeViewTransition();

export interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wrap the page content (the root layout's `children`) once: a navigation then cross-fades and rises over the
 * `--kz-motion-*` tokens, through the platform's View Transitions. Where the runtime has no `ViewTransition` it renders
 * its children untouched; under `prefers-reduced-motion` motion.css makes the change instant. The DOM always updates.
 */
export function PageTransition({ children }: PageTransitionProps) {
  if (!ViewTransition) return <>{children}</>;
  return <ViewTransition default={PAGE_TRANSITION_CLASS}>{children}</ViewTransition>;
}
