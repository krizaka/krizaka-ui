// Server-safe. Settings, read from the products' account and administration screens: a list of sections on the left
// (a row of chips that scrolls on a phone), the current section's forms on the right, each form a titled card with its
// own save at the foot. The sections are links (one page each) or anchors (one long page).
import * as React from "react";
import { tv } from "tailwind-variants";

import { Button } from "../button/button";
import { SaveStatus } from "./save-status";

export const settingsLayout = tv({
  slots: {
    root: "flex w-full flex-col gap-6",
    head: "flex flex-col gap-1",
    title: "font-display text-2xl font-extrabold tracking-tight text-fg",
    description: "max-w-2xl text-sm text-fg-secondary",
    columns: "grid grid-cols-1 gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10",
    nav: "-mx-4 overflow-x-auto overflow-y-hidden px-4 py-1 -my-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:overflow-visible lg:px-0 lg:py-0 lg:my-0",
    navList: "flex w-max gap-2 lg:sticky lg:top-20 lg:w-auto lg:flex-col lg:gap-0.5",
    navLink:
      "flex h-9 items-center gap-2.5 whitespace-nowrap rounded-sm border border-border-default bg-surface-1 px-3.5 text-sm font-medium text-fg-secondary no-underline " +
      "hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current]:border-accent aria-[current]:text-fg " +
      "lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-surface-2 lg:aria-[current]:bg-accent-soft [&>svg]:h-4 [&>svg]:w-4",
    content: "flex min-w-0 flex-col gap-6",
    section: "rounded-xl border border-border-default bg-surface-1",
    sectionHead: "flex flex-col gap-1 px-5 pt-5",
    sectionTitle: "text-base font-bold text-fg",
    sectionDescription: "text-sm text-fg-secondary",
    sectionBody: "flex flex-col gap-4 px-5 py-5",
    sectionFooter: "flex flex-wrap items-center justify-end gap-2 border-t border-border-subtle bg-surface-2/40 px-5 py-3 rounded-b-xl",
    // The flat look: no card, hairline-divided rows (Linear / Vercel / GitHub settings).
    rows: "flex flex-col divide-y divide-border-subtle border-y border-border-subtle",
    row: "flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
    rowText: "flex min-w-0 flex-col gap-0.5",
    rowLabel: "text-sm font-medium text-fg",
    rowDescription: "text-sm text-fg-secondary",
    rowControl: "flex min-w-0 shrink-0 items-center gap-2 text-sm text-fg sm:max-w-[60%] sm:justify-end",
  },
  variants: {
    variant: {
      card: {},
      flat: {
        content: "max-w-[45rem] gap-10",
        section: "rounded-none border-0 bg-transparent",
        sectionHead: "gap-0.5 px-0 pb-3 pt-0",
        sectionBody: "gap-0 px-0 py-0",
        sectionFooter: "justify-start border-t-0 bg-transparent px-0 pb-0 pt-4",
      },
    },
  },
  defaultVariants: { variant: "card" },
});

export interface SettingsNavItem {
  /** Its id (the anchor of a section on one long page). */
  id: string;
  /** Its words. */
  label: string;
  /** Where it leads: a page (`/settings/billing`) or an anchor (`#billing`). */
  href: string;
  /** Its icon (a signature icon). */
  icon?: React.ReactNode;
  /** The section shown now: `aria-current`. */
  current?: boolean;
}

export type SettingsLayoutProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The screen's title (`Settings`). */
  title?: React.ReactNode;
  /** One sentence under it. */
  description?: React.ReactNode;
  /** The sections. */
  nav: readonly SettingsNavItem[];
  /** The navigation's accessible name (`Settings sections`). */
  navLabel: string;
  /** The app's link component for the sections (Next's `Link`); an `<a>` otherwise. */
  linkAs?: React.ElementType;
  /**
   * `card` (each form a titled card) or `flat` (one calm column of at most 45rem, rows divided by hairlines).
   * @default "card"
   */
  variant?: "card" | "flat";
  /** The current section's forms (`SettingsSection`). */
  children: React.ReactNode;
};

/** A settings screen: sections on the left (chips on a phone), forms on the right. */
export function SettingsLayout({ title, description, nav, navLabel, linkAs: Link = "a", variant = "card", className, children, ...props }: SettingsLayoutProps) {
  const s = settingsLayout({ variant });
  return (
    <div className={s.root({ className })} {...props}>
      {(title || description) && (
        <div className={s.head()}>
          {title && <h1 className={s.title()}>{title}</h1>}
          {description && <p className={s.description()}>{description}</p>}
        </div>
      )}
      <div className={s.columns()}>
        <nav aria-label={navLabel} className={s.nav()}>
          <ul className={s.navList()}>
            {nav.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={s.navLink()} aria-current={item.current ? (item.href.startsWith("#") ? "location" : "page") : undefined}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.content()}>{children}</div>
      </div>
    </div>
  );
}

export interface SectionSaveLabels {
  /** “Save”. */
  save: string;
  /** “Saving…”. */
  saving: string;
  /** “Saved”. */
  saved: string;
  /** What failed, one sentence (“Could not save. Try again.”). */
  error: string;
  /** “Undo” — only shown after a save, when `onUndo` is given. */
  undo: string;
  /** “Discard changes” — only shown while dirty, when `onDiscard` is given. */
  discard: string;
}

/** The one save of a section: its dirty state, its status, its words. */
export interface SectionSave {
  /** Whether a field differs from what is saved: the save is enabled only then. */
  dirty: boolean;
  /** Where the save is (`useSaveStatus().status`). */
  status: SaveStatus;
  /** Saves the section (the form's submit, Enter included). */
  onSave: () => void;
  /** Puts the previous values back after a save, optimistic update included. */
  onUndo?: () => void;
  /** Throws the edits away while dirty. */
  onDiscard?: () => void;
  labels: SectionSaveLabels;
}

export type SettingsSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /**
   * One save for the whole section: the section becomes a form, the foot shows the Save (enabled while dirty), the
   * result in a live region (saved, or the error as an alert) and an undo after a save. Replaces `footer`.
   */
  save?: SectionSave;
  /** The section's title: it names the region (and is its anchor's target when `id` is set). */
  title: React.ReactNode;
  /** What these settings change, in one sentence. */
  description?: React.ReactNode;
  /** At the foot: the section's own save (a Button), a note. */
  footer?: React.ReactNode;
  /**
   * `card` (a titled card) or `flat` (no card: a title, then hairline-divided `SettingsRow`s).
   * @default "card"
   */
  variant?: "card" | "flat";
  /** The fields (or, flat, the `SettingsRow`s). A section of a title, a sentence and a foot action has none. */
  children?: React.ReactNode;
};

/** A group of settings: a titled card with its fields and its own save, or flat rows under a title. */
export function SettingsSection({ title, description, footer, save, variant = "card", id, className, children, ...props }: SettingsSectionProps) {
  const s = settingsLayout({ variant });
  const auto = React.useId();
  const titleId = `${id ?? auto}-title`;
  const head = (
    <div className={s.sectionHead()}>
      <h2 id={titleId} className={s.sectionTitle()}>
        {title}
      </h2>
      {description && <p className={s.sectionDescription()}>{description}</p>}
    </div>
  );
  const body = children === undefined ? null : (
    <div className={variant === "flat" ? s.rows() : s.sectionBody()} data-settings-rows={variant === "flat" ? "" : undefined}>
      {children}
    </div>
  );
  return (
    <section id={id} aria-labelledby={titleId} data-dirty={save?.dirty ? "" : undefined} className={s.section({ className })} {...props}>
      {save ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (save.dirty && save.status !== SaveStatus.Saving) save.onSave();
          }}
        >
          {head}
          {body}
          <div className={s.sectionFooter()}>
            <SaveFeedback save={save} />
            {save.onDiscard && save.dirty ? (
              <Button type="button" variant="ghost" onClick={save.onDiscard}>
                {save.labels.discard}
              </Button>
            ) : null}
            <Button type="submit" variant="primary" disabled={!save.dirty || save.status === SaveStatus.Saving} loading={save.status === SaveStatus.Saving}>
              {save.labels.save}
            </Button>
          </div>
        </form>
      ) : (
        <>
          {head}
          {body}
          {footer && <div className={s.sectionFooter()}>{footer}</div>}
        </>
      )}
    </section>
  );
}

/** The result of the last save: « Saved » (with Undo) in a polite live region, a failure as an alert. The region stays mounted so the change is announced. */
function SaveFeedback({ save }: { save: SectionSave }) {
  const failed = save.status === SaveStatus.Error;
  const saved = save.status === SaveStatus.Saved;
  return (
    <div className="mr-auto flex min-w-0 items-center gap-2 text-sm">
      <span role={failed ? "alert" : "status"} aria-live={failed ? "assertive" : "polite"} className={failed ? "text-danger-text" : "text-fg-secondary"}>
        {failed ? save.labels.error : saved ? save.labels.saved : save.status === SaveStatus.Saving ? save.labels.saving : ""}
      </span>
      {saved && save.onUndo ? (
        <Button type="button" variant="ghost" size="sm" onClick={save.onUndo}>
          {save.labels.undo}
        </Button>
      ) : null}
    </div>
  );
}

export type SettingsRowProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** What the setting is (`Username`). */
  label: React.ReactNode;
  /** The help text under it, one sentence. */
  description?: React.ReactNode;
  /** The id of the control, so the label names it (a `<label htmlFor>`). Leave out for a plain value. */
  htmlFor?: string;
  /** The control or the value, on the right (stacked under the label on a phone). */
  children?: React.ReactNode;
};

/** One setting: its label and help on the left, its control or value on the right. Put rows in a flat `SettingsSection`. */
export function SettingsRow({ label, description, htmlFor, className, children, ...props }: SettingsRowProps) {
  const s = settingsLayout();
  const Label = htmlFor ? "label" : "span";
  return (
    <div className={s.row({ className })} {...props}>
      <div className={s.rowText()}>
        <Label className={s.rowLabel()} {...(htmlFor ? { htmlFor } : {})}>
          {label}
        </Label>
        {description && <span className={s.rowDescription()}>{description}</span>}
      </div>
      {children !== undefined && <div className={s.rowControl()}>{children}</div>}
    </div>
  );
}
