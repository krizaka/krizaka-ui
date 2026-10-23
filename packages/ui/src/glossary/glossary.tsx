// Server-safe. The full list from the host's glossary catalogue.
import * as React from "react";

export interface GlossaryEntry {
  /** A stable key supplied by the host. */
  id: string;
  /** The term in the host's glossary. */
  term: React.ReactNode;
  /** The host's definition. */
  definition: React.ReactNode;
}

export interface GlossaryProps extends Omit<React.ComponentProps<"section">, "children" | "title"> {
  /** The section's visible heading. */
  title: React.ReactNode;
  /** The terms and definitions from the host's catalogue, in the desired reading order. */
  terms: readonly GlossaryEntry[];
}

/** A page or panel listing the terms and definitions from the host's glossary catalogue. */
export function Glossary({ title, terms, className, ...props }: GlossaryProps) {
  const id = React.useId();
  return (
    <section aria-labelledby={`${id}-title`} className={["kz-glossary", className].filter(Boolean).join(" ")} {...props}>
      <h2 id={`${id}-title`} className="kz-glossary-title">{title}</h2>
      <dl className="kz-glossary-list">
        {terms.map(({ id: termId, term, definition }) => (
          <div className="kz-glossary-entry" key={termId}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
