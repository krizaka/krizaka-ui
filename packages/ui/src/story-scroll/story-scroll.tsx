// One journey told while the visitor scrolls (krizaka-internal#4693): ONE sticky scene stays in view and changes with each
// step — the steps are real text (headings), the scene their decorative illustration. The light shifts colour per step, the
// guide bird moves to where the step happens, a pen stroke joins the steps and draws itself as the reader goes. The scene is
// markup from the host (server-safe): it reacts to `data-step`, `data-cue` and `data-cues` on the stage, in CSS. Still under
// reduced motion: one plate, the journey's end, every step legible. Client: the reading position.
import { Mascot, type MascotBird, type MascotMood } from "@krizaka/ui/mascots";
import { useMotionTier } from "@krizaka/ui/motion-tier";
import * as React from "react";

import { cn } from "../cn";

/** The colour the scene's light takes at a step: brand tokens only. */
export const STORY_LIGHTS = ["accent", "accent-2", "danger", "warning", "success"] as const;
export type StoryLight = (typeof STORY_LIGHTS)[number];

/** What a step does to a document scene (`DocumentScene` of `@krizaka/ui/product-page`): it arrives, is read, a line lights up, its reference attaches, you decide. */
export const STORY_CUES = ["arrive", "read", "light", "attach", "decide"] as const;
export type StoryCue = (typeof STORY_CUES)[number];

export interface StoryStep {
  /** A stable key. */
  id: string;
  /** The step, in a few words: an `h2`. */
  title: React.ReactNode;
  /** One sentence under it. */
  text?: React.ReactNode;
  /** What the scene does at this step. */
  cue?: StoryCue;
  /** The colour of the scene's light. @default "accent" */
  light?: StoryLight;
  /** The guide's mood at this step. @default "welcome" */
  mood?: MascotMood;
}

export type StoryScrollProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The section's accessible name. */
  label: string;
  /** Three to five steps, in the journey's order. */
  steps: readonly StoryStep[];
  /** The scene: one object that changes with the step (decorative: hidden from assistive technology). */
  scene: React.ReactNode;
  /** The bird that guides each step, beside the scene. */
  guide?: MascotBird;
};

function useStepInView(list: React.RefObject<HTMLOListElement | null>, enabled: boolean) {
  const [at, setAt] = React.useState(0);
  React.useEffect(() => {
    const ol = list.current;
    if (!enabled || !ol || typeof IntersectionObserver === "undefined") return;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.at));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const li of ol.children) seen.observe(li);
    return () => seen.disconnect();
  }, [list, enabled]);
  return at;
}

/** One sticky scene and the steps that pass beside it (beneath it on a phone). */
export function StoryScroll({ label, steps, scene, guide, className, ...props }: Readonly<StoryScrollProps>) {
  const tier = useMotionTier();
  const list = React.useRef<HTMLOListElement>(null);
  const seenAt = useStepInView(list, tier !== "still");
  const at = tier === "still" ? steps.length - 1 : Math.min(seenAt, steps.length - 1);
  const step = steps[at];
  const cues = steps.slice(0, at + 1).flatMap((s) => (s.cue ? [s.cue] : []));
  return (
    <section className={cn("kz-story", className)} data-tier={tier} aria-label={label} {...props}>
      <div className="kz-story-grid">
        <div className="kz-story-stage" data-step={step?.id} data-cue={step?.cue} data-cues={cues.join(" ")} data-light={step?.light ?? "accent"} aria-hidden>
          <span className="kz-story-light" />
          <div className="kz-story-object">{scene}</div>
          {guide && (
            <span className="kz-story-guide">
              <Mascot bird={guide} mood={step?.mood ?? "welcome"} size={72} life={tier !== "still"} animated={tier !== "still"} look="left" />
            </span>
          )}
          <ol className="kz-story-ticks">
            {steps.map((s, i) => (
              <li key={s.id} data-on={i <= at ? "" : undefined} />
            ))}
          </ol>
        </div>
        <div className="kz-story-col">
          <span className="kz-story-pen" aria-hidden />
          <ol ref={list} className="kz-story-steps">
            {steps.map((s, i) => (
              <li key={s.id} data-at={i} data-on={i === at ? "" : undefined} aria-current={i === at ? "step" : undefined} className="kz-story-step">
                <span className="kz-pp-mark" aria-hidden>
                  § {i + 1}
                </span>
                <h2>{s.title}</h2>
                {s.text && <p>{s.text}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
