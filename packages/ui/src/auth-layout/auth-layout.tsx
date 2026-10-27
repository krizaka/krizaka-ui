// Server-safe. Sign in, sign up, verify, reset — read from the products' entry screens: on a desktop the product's
// brand panel (its gradient, a sentence, a quote or an illustration) beside a calm column with the form; on a phone
// one column, the brand reduced to its mark above the form. Words and the product's mark arrive as props.
import type * as React from "react";
import { tv } from "tailwind-variants";

import { SectionBackdrop } from "../section-backdrop/section-backdrop";

export const authLayout = tv({
  slots: {
    root: "grid min-h-dvh w-full bg-surface-0 text-fg lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]",
    aside: "relative hidden flex-col justify-between overflow-hidden border-r border-border-subtle p-10 lg:flex",
    asideBrand: "relative flex items-center gap-2.5 font-display text-base font-bold tracking-tight",
    asideBody: "relative flex max-w-md flex-col gap-4",
    asideTitle: "font-display text-3xl font-extrabold leading-tight tracking-tight text-fg",
    asideText: "text-[15px] leading-relaxed text-fg-secondary",
    asideFoot: "relative text-xs text-fg-secondary",
    main: "flex flex-col items-center justify-center px-4 py-10 sm:px-8",
    column: "flex w-full max-w-sm flex-col gap-6",
    mobileBrand: "flex items-center gap-2.5 font-display text-base font-bold tracking-tight lg:hidden",
    head: "flex flex-col gap-1.5",
    title: "font-display text-2xl font-extrabold tracking-tight text-fg",
    description: "text-sm text-fg-secondary",
    footer: "text-center text-sm text-fg-secondary",
    legal: "text-center text-xs leading-relaxed text-fg-secondary",
  },
});
const s = authLayout();

export type AuthLayoutProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The product's mark and name (`<ProductLogo id="orazaka" /> Orazaka`): in the brand panel, and above the form on a phone. */
  brand: React.ReactNode;
  /** The form's title (`Welcome back`): the `h1`. */
  title: React.ReactNode;
  /** One sentence under the title. */
  description?: React.ReactNode;
  /** The form: fields, the primary Button, the alternatives (a passkey, a magic link). */
  children: React.ReactNode;
  /** Under the form: the other way (`No account yet? Create one`). */
  footer?: React.ReactNode;
  /** The fine print at the very bottom (terms, privacy). */
  legal?: React.ReactNode;
  /** The brand panel's promise, large (desktop). */
  promise?: React.ReactNode;
  /** The brand panel's sentence or quote under the promise (a MascotQuote, a creator's words). */
  aside?: React.ReactNode;
  /** The brand panel's foot (`© Krizaka · Montréal`). */
  asideFooter?: React.ReactNode;
};

/** An entry screen: the product's brand panel beside the form (one column on a phone). */
export function AuthLayout({ brand, title, description, children, footer, legal, promise, aside, asideFooter, className, ...props }: AuthLayoutProps) {
  return (
    <div className={s.root({ className })} {...props}>
      <SectionBackdrop as="div" grid className={s.aside()} role={promise || aside ? "complementary" : undefined} aria-hidden={!promise && !aside ? true : undefined}>
        <div className={s.asideBrand()}>{brand}</div>
        <div className={s.asideBody()}>
          {promise && <p className={s.asideTitle()}>{promise}</p>}
          {aside && <div className={s.asideText()}>{aside}</div>}
        </div>
        <div className={s.asideFoot()}>{asideFooter}</div>
      </SectionBackdrop>
      <main className={s.main()}>
        <div className={s.column()}>
          <div className={s.mobileBrand()}>{brand}</div>
          <div className={s.head()}>
            <h1 className={s.title()}>{title}</h1>
            {description && <p className={s.description()}>{description}</p>}
          </div>
          {children}
          {footer && <p className={s.footer()}>{footer}</p>}
          {legal && <p className={s.legal()}>{legal}</p>}
        </div>
      </main>
    </div>
  );
}
