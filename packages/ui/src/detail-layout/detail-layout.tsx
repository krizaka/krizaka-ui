// Server-safe. The page of one object, read from the products' detail screens (a video, a job, an account, a pack):
// its header — the way back, a media or an avatar, the name, its facts and status, the actions — then its tabs, the
// content, and a side panel (details, related, activity) that goes under the content on a phone.
import * as React from "react";
import { tv } from "tailwind-variants";

import { ProfileBanner } from "../profile-card/banner";

export const detailLayout = tv({
  slots: {
    root: "flex w-full flex-col gap-6",
    back: "inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-fg-secondary no-underline hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    header: "flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-start",
    banner: "border-b border-border-subtle pb-5",
    media: "shrink-0 overflow-hidden rounded-xl [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
    text: "flex min-w-0 flex-1 flex-col gap-2",
    eyebrow: "font-mono text-[11px] font-semibold text-fg-accent",
    titleRow: "flex flex-wrap items-center gap-2",
    title: "min-w-0 font-display text-2xl font-extrabold tracking-tight text-fg break-words",
    meta: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-secondary",
    actions: "flex shrink-0 flex-wrap items-center gap-2",
    columns: "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8",
    main: "flex min-w-0 flex-col gap-5",
    aside: "flex min-w-0 flex-col gap-4 lg:sticky lg:top-20 lg:self-start",
    section: "flex min-w-0 flex-col gap-3 rounded-xl rounded-tl-none border border-border-default bg-surface-1 p-4 sm:p-5",
    sectionTab: "-mb-3 -mt-4 w-fit rounded-t-md border border-b-0 border-border-default bg-surface-2 px-3 py-1 text-xs font-bold text-fg-secondary sm:-mt-5",
    sectionHead: "flex items-center justify-between gap-3",
    sectionTitle: "m-0 text-sm font-semibold text-fg",
    notes: "m-0 flex list-none flex-col gap-3 p-0 [counter-reset:note]",
    note: "flex gap-3 text-sm text-fg [counter-increment:note]",
    noteNum: "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold tabular-nums text-fg-secondary",
    noteBody: "flex min-w-0 flex-col gap-0.5",
    noteMeta: "text-xs text-fg-secondary",
    steps: "m-0 flex list-none flex-col gap-8 p-0",
    step: "flex min-w-0 flex-col gap-3",
    stepHead: "flex items-center gap-3",
    stepNum: "grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold tabular-nums text-on-accent",
    stepTitle: "m-0 text-base font-semibold text-fg",
    totals: "flex flex-col gap-4 rounded-xl border border-border-default bg-surface-1 p-4",
  },
});
const s = detailLayout();

export type DetailLayoutProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The way back to the list: your router's link (`<Link href="/videos">Videos</Link>`), drawn with its arrow. */
  back?: React.ReactNode;
  /** A thumbnail, a cover or an avatar beside the name; with `cover`, the avatar overlapping the cover. */
  media?: React.ReactNode;
  /**
   * A person's or a place's page (a client, a shop, a creator): the header becomes a `ProfileBanner` — this cover (an
   * `<img alt="">`, or `true` for a tint of the brand's accent), `media` as the avatar overlapping it, then the name and the actions.
   */
  cover?: React.ReactNode;
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
  /** A notes column (`DetailNotes`) at the top of the side panel, before `aside`. */
  notes?: React.ReactNode;
  /** The content (the current tab). */
  children: React.ReactNode;
};

/** One object's page: header (back, media, name, status, facts, actions), tabs, content and a side panel. */
export function DetailLayout({ back, media, cover, eyebrow, title, status, meta, actions, tabs, aside, notes, className, children, ...props }: DetailLayoutProps) {
  const side = notes || aside;
  return (
    <div className={s.root({ className })} {...props}>
      {back && <div className={s.back()}>{back}</div>}
      {cover ? (
        <ProfileBanner className={s.banner()} banner={cover === true ? undefined : cover} avatar={media} eyebrow={eyebrow} title={title} status={status} meta={meta} actions={actions} />
      ) : (
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
      )}
      {tabs}
      <div className={side ? s.columns() : undefined}>
        <div className={s.main()}>{children}</div>
        {side && (
          <aside className={s.aside()}>
            {notes}
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}

export type DetailSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The binder tab: names the section (`Invoices`). */
  title: React.ReactNode;
  /** On the right of the title: one action (`See all`). */
  action?: React.ReactNode;
  /** The title's level. @default 2 */
  level?: 2 | 3;
};

/** A binder section of the main column: a titled region on a card, its name on a tab at the top-left corner. */
export function DetailSection({ title, action, level = 2, className, children, id, ...props }: DetailSectionProps) {
  const H = level === 2 ? "h2" : "h3";
  const auto = React.useId();
  const titleId = `${id ?? auto}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className={s.section({ className })} {...props}>
      <div className={s.sectionHead()}>
        <H id={titleId} className={s.sectionTitle()}>
          {title}
        </H>
        {action}
      </div>
      {children}
    </section>
  );
}

export type DetailNote = { id: string; body: React.ReactNode; /** Who and when (`Eric · Oct 19`). */ meta?: React.ReactNode };

export type DetailNotesProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The column's name (`Notes`). */
  title: React.ReactNode;
  /** The notes, oldest first. */
  notes: readonly DetailNote[];
  /** Said when there is none. */
  emptyLabel: string;
  /** Under the list: the add field (a `Field` and a `Button`, a small form). */
  add?: React.ReactNode;
};

/** The notes column of a person's or an object's page: numbered notes and an add field. */
export function DetailNotes({ title, notes, emptyLabel, add, className, ...props }: DetailNotesProps) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className={s.section({ className })} {...props}>
      <h2 id={id} className={s.sectionTitle()}>
        {title}
      </h2>
      {notes.length === 0 ? (
        <p className={s.noteMeta()}>{emptyLabel}</p>
      ) : (
        <ol className={s.notes()}>
          {notes.map((n, i) => (
            <li key={n.id} className={s.note()}>
              <span className={s.noteNum()} aria-hidden="true">
                {i + 1}
              </span>
              <span className={s.noteBody()}>
                <span>{n.body}</span>
                {n.meta && <span className={s.noteMeta()}>{n.meta}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
      {add}
    </section>
  );
}

export type FormStepData = { id: string; title: React.ReactNode; children: React.ReactNode };

export type FormStepsProps = Omit<React.ComponentProps<"ol">, "children"> & {
  /** The steps in order: an id, a title and their fields. */
  steps: readonly FormStepData[];
};

/** The numbered steps of a long form (a new invoice: client, lines, terms): an ordered list, each step a named region. */
export function FormSteps({ steps, className, ...props }: FormStepsProps) {
  const base = React.useId();
  return (
    <ol className={s.steps({ className })} {...props}>
      {steps.map((st, i) => (
        <li key={st.id} className={s.step()}>
          <div className={s.stepHead()}>
            <span className={s.stepNum()} aria-hidden="true">
              {i + 1}
            </span>
            <h2 id={`${base}-${st.id}`} className={s.stepTitle()}>
              <span className="sr-only">{i + 1}. </span>
              {st.title}
            </h2>
          </div>
          <div role="group" aria-labelledby={`${base}-${st.id}`} className="flex min-w-0 flex-col gap-4">
            {st.children}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The totals card of a form's side panel (`aside`): sticky with the panel on a desktop, under the steps on a phone. Plain primary at `lg` inside. */
export function FormTotals({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.totals({ className })} {...props} />;
}
