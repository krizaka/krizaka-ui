import { KrizakaLogo } from "@krizaka/ui";
import type { CSSProperties, ReactNode } from "react";

import { getPageTree } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { localePath } from "@/lib/urls";

import { SiteBar } from "../SiteBar";
import { DocsLayout } from "./fumadocs/server";

/* The layout of the documentation pages (the route group `(docs)` of each language): Fumadocs' docs layout, the sidebar of
   lib/docs-source.ts and the table of contents. The workspace pages (the `(workspace)` group: the builder demo) are outside
   it — the whole width and height are theirs. */
export function DocsShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);
  return (
    <>
      {/* A hairline that fills as the page is read (globals.css; scroll-driven, absent under reduced motion). */}
      <div className="kz-read-progress" aria-hidden />
      <SiteBar version={packageVersion("ui")} />
      <DocsLayout
        tree={getPageTree(locale)}
        nav={{ title: <><KrizakaLogo size={18} animated={false} /> {t.docs.sections.ui.title}</>, url: localePath(locale, "/") }}
        themeSwitch={{ enabled: false }}
        containerProps={{ className: "kz-docs", style: { "--fd-banner-height": "var(--kz-docs-top)" } as CSSProperties }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
