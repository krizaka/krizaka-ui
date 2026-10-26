// Server-safe. A thin band above the app bar, in the page frame, that says this deployment is not the real offer. Server-rendered
// with a minimum height (CLS 0); renders nothing in production. Words arrive as props. It is not dismissible: a person who
// must know this is a development version should not be able to lose the line by accident.
import type * as React from "react";
import { tv } from "tailwind-variants";

import { environmentNotice } from "./model";

export const environmentNoticeStyles = tv({
  slots: {
    root: "w-full border-b border-warning/50 bg-warning/10 text-fg",
    inner: "mx-auto flex min-h-9 w-full max-w-[var(--kz-page-max,72rem)] items-center gap-3 px-[var(--kz-page-gutter,1rem)] py-1.5 text-xs leading-snug",
    dot: "h-2 w-2 shrink-0 rounded-full bg-warning",
    text: "min-w-0 flex-1",
    title: "font-semibold text-fg",
    message: "text-fg-secondary",
    link: "shrink-0 font-semibold text-fg-accent underline-offset-2 hover:underline focus-visible:focus-ring",
  },
});

export type EnvironmentNoticeProps = Omit<React.ComponentProps<"div">, "title" | "children"> & {
  /** The deployment's stage, read once by the app. `production` (or `prod`) renders nothing; any other value shows the notice. */
  stage: string | null | undefined;
  /** The headline (« Development version »): also the region's accessible name. Passed translated. */
  title: string;
  /** The line (« Data can be reset at any time. Not a commercial offer. »). Passed translated. */
  message: string;
  /** An optional way to learn more. `linkAs` renders it with your router's Link. */
  link?: { label: string; href: string };
  /** Renders the link with your router's Link (`next/link`) instead of an `<a>`. */
  linkAs?: React.ElementType;
};

export function EnvironmentNotice({ stage, title, message, link, linkAs, className, ...props }: EnvironmentNoticeProps) {
  const content = environmentNotice({ stage, title, message, link });
  if (!content) return null;
  const s = environmentNoticeStyles();
  const Link = linkAs ?? "a";
  return (
    <div role="region" aria-label={content.title} data-stage={content.stage} className={s.root({ className })} {...props}>
      <div className={s.inner()}>
        <span aria-hidden className={s.dot()} />
        <p className={s.text()}>
          <span className={s.title()}>{content.title}</span> <span className={s.message()}>{content.message}</span>
        </p>
        {content.link ? (
          <Link href={content.link.href} className={s.link()}>
            {content.link.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
