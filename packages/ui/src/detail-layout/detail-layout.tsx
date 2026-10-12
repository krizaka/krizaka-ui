// Server-safe. The page of one object, read from the products' detail screens (a video, a job, an account, a pack):
// its header — the way back, a media or an avatar, the name, its facts and status, the actions — then its tabs, the
// content, and a side panel (details, related, activity) that goes under the content on a phone.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const detailLayout = tv({
  slots: {
    root: "flex w-full flex-col gap-6",
    back: "inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-fg-secondary no-underline hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    header: "flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-start",
    media: "shrink-0 overflow-hidden rounded-xl [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
    text: "flex min-w-0 flex-1 flex-col gap-2",
    eyebrow: "font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-accent",
    titleRow: "flex flex-wrap items-center gap-2",
    title: "min-w-0 font-display text-2xl font-extrabold tracking-tight text-fg break-words",
    meta: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-secondary",
    actions: "flex shrink-0 flex-wrap items-center gap-2",
    columns: "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8",
    main: "flex min-w-0 flex-col gap-5",
    aside: "flex min-w-0 flex-col gap-4 lg:sticky lg:top-20 lg:self-start",
  },
});
const s = detailLayout();

export type DetailLayoutProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The way back to the list: your router's link (`<Link href="/videos">Videos</Link>`), drawn with its arrow. */
  back?: React.ReactNode;
  /** A thumbnail, a cover or an avatar beside the name. */
  media?: React.ReactNode;
  /** A mono line above the name (the object's kind, its id). */
  eyebrow?: React.ReactNode;
  /** The object's name: the `h1`. */
  title: React.ReactNode;
  /** Beside the name: its status (a Badge). */
  status?: React.ReactNode;
  /** Under the name: its facts (the author, a date, a count — `Facts` or plain text). */
  meta?: React.ReactNode;
  /** The object's actions (edit, publish, a DropdownMenu). */
  actions?: React.ReactNode;
  /** Under the header: the object's tabs (`Tabs.List` of @krizaka/ui/tabs, inside your `Tabs.Root` around the layout). */
  tabs?: React.ReactNode;
  /** The side panel: details, related objects, activity (under the content on a phone). */
  aside?: React.ReactNode;
  /** The content (the current tab). */
  children: React.ReactNode;
};

/** One object's page: header (back, media, name, status, facts, actions), tabs, content and a side panel. */
export function DetailLayout({ back, media, eyebrow, title, status, meta, actions, tabs, aside, className, children, ...props }: DetailLayoutProps) {
  return (
    <div className={s.root({ className })} {...props}>
      {back && <div className={s.back()}>{back}</div>}
      <div className={s.header()}>
        {media && <div className={s.media()}>{media}</div>}
        <div className={s.text()}>
          {eyebrow && <p className={s.eyebrow()}>{eyebrow}</p>}
          <div className={s.titleRow()}>
            <h1 className={s.title()}>{title}</h1>
            {status}
          </div>
          {meta && <div className={s.meta()}>{meta}</div>}
        </div>
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
      {tabs}
      <div className={aside ? s.columns() : undefined}>
        <div className={s.main()}>{children}</div>
        {aside && <aside className={s.aside()}>{aside}</aside>}
      </div>
    </div>
  );
}
