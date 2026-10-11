// Client (one IntersectionObserver). The table of contents of a reading page (blocks.css): sticky beside the content on
// a wide screen, a row of chips that scrolls sideways on a phone. The section being read is marked (`aria-current`).
import * as React from "react";

import { cn } from "../cn";

export type TocProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The navigation's name and visible label: `On this page`. */
  label: string;
  /** The sections, in order: the id of each section's title and its words. */
  items: readonly { id: string; label: React.ReactNode }[];
};

/** The sections of the page, the one being read marked. */
export function Toc({ label, items, className, ...props }: TocProps) {
  const [active, setActive] = React.useState(items[0]?.id);
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className={cn("kz-toc", className)} aria-label={label} {...props}>
      <p className="kz-label">{label}</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined} onClick={() => setActive(i.id)}>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type TocLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The table of contents (a `Toc`). */
  toc: React.ReactNode;
  /** The page's sections. */
  children: React.ReactNode;
};

/** A reading page: the table of contents in a sticky column on the left, the sections beside it (one column on a phone). */
export function TocLayout({ toc, children, className, ...props }: TocLayoutProps) {
  return (
    <div className={cn("kz-toc-layout", className)} {...props}>
      <aside className="kz-toc-aside">{toc}</aside>
      <div className="kz-toc-main">{children}</div>
    </div>
  );
}
