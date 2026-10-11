// Server-safe. A dashboard, read from the products' home screens (Orochia's creator studio, Orazaka's console for
// Eric): the screen's heading with its actions and filters, then a responsive grid of widgets — one column on a phone,
// two from `sm`, four from `xl`; a widget spans 1, 2, 3 columns or the full row, and keeps its order everywhere.
import * as React from "react";
import { tv } from "tailwind-variants";

export const dashboardLayout = tv({
  slots: {
    root: "flex w-full flex-col gap-6",
    head: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
    text: "flex min-w-0 flex-col gap-1",
    eyebrow: "font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-accent",
    title: "font-display text-2xl font-extrabold tracking-tight text-fg sm:text-[1.75rem]",
    description: "max-w-2xl text-sm text-fg-secondary",
    actions: "flex shrink-0 flex-wrap items-center gap-2",
    toolbar: "flex flex-wrap items-center gap-2",
    grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
    widget: "flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-surface-1 p-4 sm:p-5",
    widgetHead: "flex items-start justify-between gap-3",
    widgetTitle: "text-sm font-semibold text-fg",
    widgetDescription: "mt-0.5 text-xs text-fg-secondary",
    widgetBody: "min-w-0 flex-1",
  },
  variants: {
    span: {
      1: { widget: "" },
      2: { widget: "sm:col-span-2" },
      3: { widget: "sm:col-span-2 xl:col-span-3" },
      full: { widget: "sm:col-span-2 xl:col-span-4" },
    },
  },
  defaultVariants: { span: 1 },
});
const s = dashboardLayout();

export type DashboardLayoutProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The screen's title: `Good morning, Eric`. */
  title: React.ReactNode;
  /** A mono line above it (the workspace, the date). */
  eyebrow?: React.ReactNode;
  /** One sentence under it. */
  description?: React.ReactNode;
  /** The screen's actions (a primary Button, a DropdownMenu). */
  actions?: React.ReactNode;
  /** Under the heading: the period, the filters (Segmented tabs, a DateRangePicker, a FilterBar). */
  toolbar?: React.ReactNode;
  /**
   * The heading's level: `h1` when the dashboard is the screen, `h2` inside an AppShell whose header holds the h1.
   * @default "h1"
   */
  headingAs?: "h1" | "h2";
  /** The widgets (`Widget`), in reading order. */
  children: React.ReactNode;
};

/** A dashboard screen: heading, actions, filters, then the grid of widgets. */
export function DashboardLayout({ title, eyebrow, description, actions, toolbar, headingAs: H = "h1", className, children, ...props }: DashboardLayoutProps) {
  return (
    <div className={s.root({ className })} {...props}>
      <div className={s.head()}>
        <div className={s.text()}>
          {eyebrow && <p className={s.eyebrow()}>{eyebrow}</p>}
          <H className={s.title()}>{title}</H>
          {description && <p className={s.description()}>{description}</p>}
        </div>
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
      {toolbar && <div className={s.toolbar()}>{toolbar}</div>}
      <div className={s.grid()}>{children}</div>
    </div>
  );
}

export type WidgetProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The widget's title: it names the region. */
  title: React.ReactNode;
  /** One line under the title (the period, the source). */
  description?: React.ReactNode;
  /** An action on the right of the title (`See all`). */
  action?: React.ReactNode;
  /**
   * The columns it takes: 1, 2, 3 or the full row (from `sm`; one column on a phone).
   * @default 1
   */
  span?: 1 | 2 | 3 | "full";
  /**
   * The title's level: one under the dashboard's heading — `2` under an `h1`, `3` inside an AppShell (`headingAs="h2"`).
   * @default 2
   */
  level?: 2 | 3;
  /** The content: a Stat, a chart of @krizaka/charts, a DataTable, a list. */
  children: React.ReactNode;
};

/** A widget of the dashboard: a titled region on a card. */
export function Widget({ title, description, action, span = 1, level = 2, className, children, id, ...props }: WidgetProps) {
  const H = level === 2 ? "h2" : "h3";
  const sv = dashboardLayout({ span });
  const auto = React.useId();
  const titleId = `${id ?? auto}-title`;
  return (
    <section className={sv.widget({ className })} aria-labelledby={titleId} id={id} {...props}>
      <div className={s.widgetHead()}>
        <div className="min-w-0">
          <H id={titleId} className={s.widgetTitle()}>
            {title}
          </H>
          {description && <p className={s.widgetDescription()}>{description}</p>}
        </div>
        {action}
      </div>
      <div className={s.widgetBody()}>{children}</div>
    </section>
  );
}
