import "@/app/globals.css";
/* The page blocks and the storytelling kit of @krizaka/ui (their live examples): their stylesheets, by package path. */
import "@krizaka/ui/blocks.css";
import "@krizaka/tokens/shop-presets.css"; // the look presets of the shop page examples (`data-shop-preset`)
import "@krizaka/ui/story.css";

import { KrizakaLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { MotionObserver } from "@krizaka/ui/motion";
import { ThemeProvider, ThemeScript } from "@krizaka/ui/theme";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import { fontVariables } from "@/app/fonts";
import { getPageTree } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { SITE_URL } from "@/lib/site";
import { buildSiteGraph } from "@/lib/structured-data";
import { localePath } from "@/lib/urls";

import { DocsChrome } from "./docs/DocsChrome";
import { I18nProvider } from "./I18nProvider";
import { JsonLd } from "./JsonLd";
import { SiteBar } from "./SiteBar";
import { SiteFooter } from "./SiteFooter";
import { ThemeSync } from "./SiteTheme";

/** What every page of a language shares: the title template, the description, the Open Graph card, the icon. */
export function siteMetadata(locale: Locale): Metadata {
  const m = getDictionary(locale).site.meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.title, template: m.titleTemplate },
    description: m.description,
    applicationName: "Krizaka UI",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
      ],
      apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    },
    openGraph: {
      siteName: "Krizaka UI",
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_CA",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: m.ogAlt }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
    robots: { index: true, follow: true },
  };
}

export const siteViewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0d0d0f" };

/* The root of every page, in one language (each language has its own root layout, for <html lang>): the theme before
   the first paint, the providers, the bar, Fumadocs' docs layout (the sidebar of lib/docs-source.ts, the table of
   contents), the footer. */
export function SiteRoot({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);
  return (
    <html lang={locale} className={cn(fontVariables, "h-full dark")} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* The persisted theme (`kz-theme`), else dark, applied before the first paint: no flash. */}
        <ThemeScript defaultMode="dark" />
        <link rel="preconnect" href="https://krizaka-assets.b-cdn.net" />
        <JsonLd data={buildSiteGraph(locale)} />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <ThemeProvider defaultMode="dark">
          <ThemeSync />
          <I18nProvider locale={locale} messages={t}>
            <DocsChrome>
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
              <SiteFooter locale={locale} />
            </DocsChrome>
          </I18nProvider>
          <MotionObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
