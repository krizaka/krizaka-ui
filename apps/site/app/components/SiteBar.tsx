"use client";

/* The bar of ui.krizaka.com, on @krizaka/ui's NavBar, in the three zones every Krizaka site shares (NAV-SYS):
   left, who this is — the Krizaka UI mark, then the family (until NavBar.Family ships: "by Krizaka", the way back to
   www.krizaka.com; Krizaka Java and the rest of the family are in the footer); centre, this site — Get started ·
   Foundations · Components · Templates and the version it documents; right, the tools — search (Fumadocs' dialog, ⌘K),
   the repository, the theme, the language. */

import { MoonIcon, SearchIcon, SunIcon } from "@krizaka/icons";
import { KrizakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { Kbd } from "@krizaka/ui/kbd";
import { NavBar } from "@krizaka/ui/nav-bar";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { KRIZAKA_UI_REPO_URL, KRIZAKA_URL } from "@/lib/site";
import { localePath } from "@/lib/urls";

import { GitHubMark } from "./GitHubMark";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";

const LINKS = [
  { id: "getStarted", path: "/installation", match: ["/installation", "/theming", "/packages", "/mobile"] },
  { id: "foundations", path: "/foundations/tokens", match: ["/foundations"] },
  { id: "components", path: "/components", match: ["/components"] },
  { id: "templates", path: "/templates", match: ["/templates"] },
] as const;

export function SiteBar({ version }: { version: string }) {
  const { t, locale, toggleLocale } = useI18n();
  const b = t.site.bar;
  const { theme, toggleTheme } = useSiteTheme();
  const { setOpenSearch } = useSearchContext();
  const path = (usePathname() ?? "/").replace(/^\/fr(?=\/|$)/, "") || "/";

  return (
    <div className="kz-site-bar-wrap pointer-events-none fixed inset-x-0 top-3 z-50">
      <NavBar.Root label={b.mainAria} className="kz-site-bar pointer-events-auto" data-frame="docs">
        <NavBar.Brand asChild>
          <Link href={localePath(locale, "/")}>
            <KrizakaLogo size={26} />
            {b.label}
          </Link>
        </NavBar.Brand>
        <a href={KRIZAKA_URL} aria-label={b.projectAria} className="hidden text-xs font-medium text-fg-secondary hover:text-fg md:inline">
          {b.by}
        </a>

        <NavBar.Items>
          {LINKS.map((l) => (
            <NavBar.Link key={l.id} asChild active={l.match.some((m) => path.startsWith(m))}>
              <Link href={localePath(locale, l.path)}>{b[l.id]}</Link>
            </NavBar.Link>
          ))}
        </NavBar.Items>
        <span className="kz-chip-meta hidden font-mono lg:inline-flex" title={b.versionTitle}>
          v{version}
        </span>

        <NavBar.Actions className="gap-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            shape="pill"
            onClick={() => setOpenSearch(true)}
            aria-label={b.searchAria}
            aria-keyshortcuts="Meta+K Control+K"
            className="w-9 px-0 font-normal text-fg-secondary lg:w-auto lg:pl-3 lg:pr-1.5"
          >
            <SearchIcon size={14} />
            <span className="hidden lg:inline">{b.search}</span>
            <Kbd className="hidden lg:inline-flex">⌘K</Kbd>
          </Button>

          <span aria-hidden className="mx-1 hidden h-4 w-px bg-border-subtle lg:block" />

          <Button asChild variant="ghost" size="icon" shape="pill" className="h-9 w-9">
            <a href={KRIZAKA_UI_REPO_URL} target="_blank" rel="noopener noreferrer" aria-label={b.githubAria}>
              <GitHubMark size={15} />
            </a>
          </Button>

          <Button type="button" variant="ghost" size="icon" shape="pill" onClick={toggleTheme} aria-label={theme === "dark" ? b.lightMode : b.darkMode} className="h-9 w-9">
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLocale}
            aria-label={b.switchLanguage}
            className="h-7 w-9 px-0 font-mono text-[11px] font-semibold tracking-wide"
          >
            {b.languageShort}
          </Button>

        </NavBar.Actions>
      </NavBar.Root>
    </div>
  );
}
