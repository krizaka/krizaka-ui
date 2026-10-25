// Client (Radix Tooltip): an inline term whose definition is available on keyboard focus as well as hover.
import type * as React from "react";

import { Tooltip } from "../tooltip";

export interface GlossaryTermProps {
  /** The word in the host's glossary. */
  term: string;
  /** The host's definition. */
  definition: React.ReactNode;
}

/** An underlined glossary word with a keyboard- and screen-reader-accessible definition tooltip. */
export function GlossaryTerm({ term, definition }: GlossaryTermProps) {
  return (
    <Tooltip content={definition}>
      <dfn tabIndex={0} className="kz-glossary-term">{term}</dfn>
    </Tooltip>
  );
}
