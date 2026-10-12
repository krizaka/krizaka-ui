// Server-safe. Settings, read from the products' account and administration screens: a list of sections on the left
// (a row of chips that scrolls on a phone), the current section's forms on the right, each form a titled card with its
// own save at the foot. The sections are links (one page each) or anchors (one long page).
import * as React from "react";
import { tv } from "tailwind-variants";

export const settingsLayout = tv({
  slots: {
    root: "flex w-full flex-col gap-6",
    head: "flex flex-col gap-1",
    title: "font-display text-2xl font-extrabold tracking-tight text-fg",
    description: "max-w-2xl text-sm text-fg-secondary",
    columns: "grid grid-cols-1 gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10",
    nav: "-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0",
    navList: "flex w-max gap-2 lg:sticky lg:top-20 lg:w-auto lg:flex-col lg:gap-0.5",
    navLink:
      "flex h-9 items-center gap-2.5 whitespace-nowrap rounded-full border border-border-default bg-surface-1 px-3.5 text-sm font-medium text-fg-secondary no-underline " +
      "hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current]:border-accent aria-[current]:text-fg " +
      "lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-surface-2 lg:aria-[current]:bg-accent-soft [&>svg]:h-4 [&>svg]:w-4",
    content: "flex min-w-0 flex-col gap-6",
    section: "rounded-xl border border-border-default bg-surface-1",
    sectionHead: "flex flex-col gap-1 px-5 pt-5",
    sectionTitle: "text-base font-bold text-fg",
    sectionDescription: "text-sm text-fg-secondary",
    sectionBody: "flex flex-col gap-4 px-5 py-5",
    sectionFooter: "flex flex-wrap items-center justify-end gap-2 border-t border-border-subtle bg-surface-2/40 px-5 py-3 rounded-b-xl",
  },
});
const s = settingsLayout();

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
  /** The current section's forms (`SettingsSection`). */
  children: React.ReactNode;
};

/** A settings screen: sections on the left (chips on a phone), forms on the right. */
export function SettingsLayout({ title, description, nav, navLabel, linkAs: Link = "a", className, children, ...props }: SettingsLayoutProps) {
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

export type SettingsSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The section's title: it names the region (and is its anchor's target when `id` is set). */
  title: React.ReactNode;
  /** What these settings change, in one sentence. */
  description?: React.ReactNode;
  /** At the foot: the section's own save (a Button), a note. */
  footer?: React.ReactNode;
  /** The fields. */
  children: React.ReactNode;
};

/** A group of settings: a titled card with its fields and its own save. */
export function SettingsSection({ title, description, footer, id, className, children, ...props }: SettingsSectionProps) {
  const auto = React.useId();
  const titleId = `${id ?? auto}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className={s.section({ className })} {...props}>
      <div className={s.sectionHead()}>
        <h2 id={titleId} className={s.sectionTitle()}>
          {title}
        </h2>
        {description && <p className={s.sectionDescription()}>{description}</p>}
      </div>
      <div className={s.sectionBody()}>{children}</div>
      {footer && <div className={s.sectionFooter()}>{footer}</div>}
    </section>
  );
}
