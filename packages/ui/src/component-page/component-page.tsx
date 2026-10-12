// Server-safe. The page of one component of a design system (what krizaka.com/docs/ui draws from the registry): its
// name, summary, status and platforms; the live preview with its code; installation; when to use it and when not; its
// examples; its props; its accessibility — the facts in a side column that goes under the content on a phone.
import { CodeBlock } from "@krizaka/ui/code-block";
import { DetailLayout } from "@krizaka/ui/detail-layout";
import { type Fact, Facts, Section } from "@krizaka/ui/page";
import type * as React from "react";

export interface ComponentPageSection {
  /** The section's anchor. */
  id: string;
  /** Its title (`When to use`, `Props`). */
  title: React.ReactNode;
  /** Its content (lists, a props table, examples). */
  children: React.ReactNode;
}

export type ComponentPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The way back to the catalogue (your router's link). */
  back?: React.ReactNode;
  /** The category (`Blocks`, `Forms`). */
  eyebrow?: React.ReactNode;
  /** The component's name: the `h1`. */
  title: React.ReactNode;
  /** Its summary, in one sentence. */
  summary: React.ReactNode;
  /** Its status and platforms. */
  facts?: readonly Fact[];
  /** The live preview of its first example (a framed stage with its code). */
  preview: React.ReactNode;
  /** The line to install or import it, and the copy words. */
  install?: { code: string; language?: string; copyLabel: string; copiedLabel: string; file?: React.ReactNode };
  /** The sections, in reading order: when to use / not, examples, props, accessibility. */
  sections: readonly ComponentPageSection[];
  /** The side column: related components, source, the version. */
  aside?: React.ReactNode;
};

/** A component's page: name, summary, facts, live preview, install, then its sections; facts and related aside. */
export function ComponentPage({ back, eyebrow, title, summary, facts, preview, install, sections, aside, ...props }: ComponentPageProps) {
  return (
    <DetailLayout back={back} eyebrow={eyebrow} title={title} meta={<span>{summary}</span>} aside={aside} {...props}>
      {facts && facts.length > 0 && <Facts items={facts} />}
      <div className="kz-tpl-stage">{preview}</div>
      {install && <CodeBlock code={install.code} language={install.language ?? "bash"} file={install.file} copyLabel={install.copyLabel} copiedLabel={install.copiedLabel} />}
      <div className="kz-tpl-flush">
        {sections.map((s) => (
          <Section key={s.id} id={s.id} title={s.title} headingSize="sm" spacing="sm" size="full" divider>
            {s.children}
          </Section>
        ))}
      </div>
    </DetailLayout>
  );
}
