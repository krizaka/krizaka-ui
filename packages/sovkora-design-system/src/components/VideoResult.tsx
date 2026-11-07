"use client";

/**
 * @file VideoResult.tsx
 * @description What a video run of an Sovkora Studio leaves: the clip in its player, the exact prompt, what the run
 * recorded (model, seed, frame, length, time, cost, run id), the command that makes it again and a download. Words are
 * props; nothing is fetched.
 */
import { Button } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { CodeBlock } from "@krizaka/ui/code-block";
import type * as React from "react";

import { ClipPlayer, type ClipPlayerLabels, type ClipSources } from "./ClipPlayer";
import { type RunFact,RunFacts } from "./RunFacts";

/** One fact of the run (see {@link RunFact}). */
export type VideoResultFact = RunFact;

/** Every word of the component, translated by the app. */
export interface VideoResultLabels extends ClipPlayerLabels {
  /** The heading of the prompt. */
  prompt: string;
  /** The heading of the run's facts. */
  facts: string;
  /** The heading of the command. */
  reproduce: string;
  /** The copy button of the command. */
  copy: string;
  /** What the copy button says once the command is copied. */
  copied: string;
  /** The download button. */
  download: string;
}

/** Props of {@link VideoResult}. */
export interface VideoResultProps {
  /** The accessible name of the video: what it shows, in a sentence. */
  title: string;
  /** The files: H.264 `mp4` (always), `webm` when there is one, and the poster. */
  sources: ClipSources;
  /** The frame the clip was made in; a portrait one is drawn as tall as a phone allows, a landscape one 16:9. */
  orientation?: "landscape" | "portrait";
  /** The exact prompt that reached the model. */
  prompt: string;
  /** Replaces the plain prompt (the app may type it in, over its final size): the heading stays. */
  promptNode?: React.ReactNode;
  /** What the run recorded, in reading order (model, seed, frame, length, time, cost, run id). */
  facts: readonly VideoResultFact[];
  /** The CLI command that makes the clip again; without it there is no "Reproduce it". */
  reproduce?: string;
  /** One sentence above the command. */
  reproduceLead?: string;
  /** Where the file can be downloaded; without it there is no download button. */
  downloadHref?: string;
  /** The words. */
  labels: VideoResultLabels;
  /** Extra classes on the root, merged last. */
  className?: string;
}

const heading = "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-accent";

/**
 * The result of a video run: the player (a muted loop in view, badge, controls, opens larger), the prompt, the facts,
 * "Reproduce it" and the download.
 *
 * @param props - {@link VideoResultProps}
 * @returns The result card of a video run.
 */
export function VideoResult({
  title,
  sources,
  orientation = "landscape",
  prompt,
  promptNode,
  facts,
  reproduce,
  reproduceLead,
  downloadHref,
  labels,
  className,
}: Readonly<VideoResultProps>) {
  return (
    <article className={cn("space-y-5", className)} data-orientation={orientation}>
      <figure className="overflow-hidden rounded-2xl border border-border-default bg-surface-2">
        <ClipPlayer sources={sources} title={title} labels={labels} orientation={orientation} />
      </figure>
      <section aria-label={labels.prompt} className="space-y-2">
        <h3 className={heading}>{labels.prompt}</h3>
        {promptNode ?? (
          <blockquote lang="en" className="text-sm leading-relaxed text-fg-secondary">
            {prompt}
          </blockquote>
        )}
      </section>
      <section aria-label={labels.facts} className="space-y-2">
        <h3 className={heading}>{labels.facts}</h3>
        <RunFacts facts={facts} />
      </section>
      {reproduce && (
        <section aria-label={labels.reproduce} className="space-y-2">
          <h3 className={heading}>{labels.reproduce}</h3>
          {reproduceLead && <p className="text-xs leading-relaxed text-fg-secondary">{reproduceLead}</p>}
          <CodeBlock
            code={reproduce}
            language="bash"
            file="Terminal"
            copyLabel={labels.copy}
            copiedLabel={labels.copied}
          />
        </section>
      )}
      {downloadHref && (
        <Button asChild variant="secondary" size="md">
          <a href={downloadHref} download>
            {labels.download}
          </a>
        </Button>
      )}
    </article>
  );
}
