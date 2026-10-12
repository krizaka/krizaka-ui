// Server-safe. When a page is not there (blocks.css `.kz-tpl-error`): the code drawn huge in outline, the bird that
// lost its way beside it, one sentence, a search, and the ways back — never a dead end. The same frame as every page.
import type * as React from "react";

import { cn } from "../cn";

export type ErrorPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The code (`404`, `500`): drawn, not read — the title says it in words. */
  code: string;
  /** The bird beside the code (a Mascot in its `empty` or `error` mood). */
  mascot?: React.ReactNode;
  /** The page's `h1` (`This page took another road`). */
  title: React.ReactNode;
  /** What happened and what to do, in one or two sentences. */
  text?: React.ReactNode;
  /** A search, to find what was meant. */
  search?: React.ReactNode;
  /** The ways back (an ActionBar: home, the docs, contact). */
  actions?: React.ReactNode;
  /** Under the actions: the most visited pages. */
  children?: React.ReactNode;
};

/** An error page: the code drawn, the bird, a sentence, a search and the ways back. */
export function ErrorPage({ code, mascot, title, text, search, actions, className, children, ...props }: ErrorPageProps) {
  return (
    <div className={cn("kz-frame kz-tpl-error", className)} {...props}>
      <p className="kz-tpl-error-code" aria-hidden>
        {code}
        {mascot}
      </p>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
      {search && <div className="kz-tpl-error-search">{search}</div>}
      {actions}
      {children}
    </div>
  );
}
