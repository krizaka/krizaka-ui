// Server-safe. The top of a page: an optional breadcrumb, the title (h1), a description and the page's actions.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const pageHeader = tv({
  slots: {
    root: "flex flex-col gap-3 border-b border-border-subtle pb-6",
    breadcrumb: "text-xs text-fg-secondary",
    row: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
    text: "flex min-w-0 flex-col gap-1.5",
    title: "font-display text-2xl font-black tracking-tight text-fg sm:text-3xl",
    description: "max-w-2xl text-sm text-fg-secondary",
    actions: "flex shrink-0 flex-wrap items-center gap-2",
  },
});
const s = pageHeader();

export type PageHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The title of the page (an `h1`, or `as="h2"`). */
  title: React.ReactNode;
  /** A sentence under the title. */
  description?: React.ReactNode;
  /** The page's actions: Buttons, a DropdownMenu. */
  actions?: React.ReactNode;
  /** A breadcrumb (the product's own <nav aria-label>), shown above the title. */
  breadcrumb?: React.ReactNode;
  /** The heading level of the title: `h1` for a page, `h2` for a section that looks like one. */
  as?: "h1" | "h2";
};

export function PageHeader({ title, description, actions, breadcrumb, as: Heading = "h1", className, ...props }: PageHeaderProps) {
  return (
    <div className={s.root({ className })} {...props}>
      {breadcrumb && <div className={s.breadcrumb()}>{breadcrumb}</div>}
      <div className={s.row()}>
        <div className={s.text()}>
          <Heading className={s.title()}>{title}</Heading>
          {description && <p className={s.description()}>{description}</p>}
        </div>
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
    </div>
  );
}
