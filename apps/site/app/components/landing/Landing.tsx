import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { Sparkline } from "@krizaka/charts/sparkline";
import { Button } from "@krizaka/ui/button";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock } from "@krizaka/ui/code-block";
import { LinkCard } from "@krizaka/ui/link-card";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { familyLabels } from "@krizaka/ui/sites";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import Link from "next/link";

import { familyLinks } from "@/lib/family-links";
import { githubStars, showStars } from "@/lib/github-stars";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { WEB_INSTALL } from "@/lib/install";
import { npmDownloads, sumKnown } from "@/lib/npm-downloads";
import { catalogEntries, catalogFamilies } from "@/lib/ui-catalog";
import { FILTER_KEYS, JOBS, PATTERNS } from "@/lib/ui-ia";
import { PLAYGROUNDS } from "@/lib/ui-playgrounds";
import { getRegistryItem, getRegistryItems } from "@/lib/ui-registry";
import { localePath } from "@/lib/urls";

import { FamilyCards } from "../docs/FamilyCards";
import { PlayStage } from "../docs/StageFrame";
import { HeroKit } from "./HeroKit";
import { HomeStudio, SceneSweep } from "./HomeStudio";
import { ProductScene } from "./ProductScene";

/* The home of ui.krizaka.com — « Touch it », « Built with it », « Play with it », then the kit:
   1. the hero: who it is for, the install line to copy, the two ways in, the figures (registries, npm, GitHub — read at
      build, a figure that could not be read is not shown) and, beside it, the live kit — real components under the
      identity and the theme a visitor picks (HeroKit; the identity is the same one the dock and the scene wear);
   2. the scene: one product on the web and on a phone, both screens composed from the real components, re-skinned
      live by the identity dock that floats at the bottom while the studio is in view (the one wow);
   3. the playground: the component-page stage (props, web · iOS · Android, the code) for a few components, under the
      same identity;
   4. the families of the catalogue, live covers and counts from the registry;
   5. where each package lives. */

const PACKAGES: { name: string; path?: string; dir: string }[] = [
  { name: "@krizaka/ui", path: "/components", dir: "ui" },
  { name: "@krizaka/tokens", path: "/foundations/tokens", dir: "tokens" },
  { name: "@krizaka/tailwind", path: "/packages/tailwind", dir: "tailwind" },
  { name: "@krizaka/fonts", path: "/foundations/typography", dir: "fonts" },
  { name: "@krizaka/icons", path: "/foundations/icons", dir: "icons" },
  { name: "@krizaka/charts", path: "/components/line-chart", dir: "charts" },
  { name: "@krizaka/intl", path: "/packages/intl", dir: "intl" },
  { name: "@krizaka/i18n", path: "/packages/i18n", dir: "i18n" },
  { name: "@krizaka/query", path: "/packages/query", dir: "query" },
  { name: "@krizaka/realtime", path: "/packages/realtime", dir: "realtime" },
  { name: "@krizaka/push", path: "/packages/push", dir: "push" },
  { name: "@krizaka/app-config", path: "/packages/app-config", dir: "app-config" },
  { name: "@krizaka/config", path: "/packages/config", dir: "config" },
];

/** A package's description, cut to its first clause (before a colon or a full stop), at most ~90 characters. */
function short(text: string): string {
  const clause = text.split(/:\s|(?<=\.)\s/)[0] ?? "";
  if (clause.length <= 90) return clause.replace(/\.$/, "");
  return `${clause.slice(0, 88).replace(/\s+\S*$/, "")}…`;
}

/** The workspace packages published on npm (not private): what "packages on npm" counts. */
function publishedPackages(): { dir: string; description: string }[] {
  const root = path.join(process.cwd(), "..", "..", "packages");
  return readdirSync(root).flatMap((dir) => {
    try {
      const pkg = JSON.parse(readFileSync(path.join(root, dir, "package.json"), "utf8")) as { private?: boolean; description?: string };
      return pkg.private ? [] : [{ dir, description: short(pkg.description ?? "") }];
    } catch {
      return [];
    }
  });
}

export async function Landing({ locale }: { locale: Locale }) {
  const all = getDictionary(locale);
  const t = all.landing;
  const items = getRegistryItems().filter((item) => item.status !== "deprecated");
  const published = publishedPackages();
  const about = new Map(published.map((p) => [p.dir, p.description]));
  const count = items.length;
  // Read from api.npmjs.org and api.github.com at build; what could not be read is not shown (lib/npm-downloads.ts, lib/github-stars.ts).
  const [downloads, stars] = await Promise.all([npmDownloads(PACKAGES.map((p) => p.name)), githubStars("krizaka/krizaka-ui")]);
  const weeklyTotal = sumKnown(PACKAGES.map((p) => downloads.get(p.name)?.weekly));
  const figures = [
    { id: "components", value: count, label: t.facts.components },
    { id: "native", value: items.filter((item) => item.platforms !== "web").length, label: t.facts.native },
    ...(weeklyTotal === undefined ? [] : [{ id: "downloads", value: weeklyTotal, label: t.facts.downloads }]),
    ...(showStars(stars) ? [{ id: "stars", value: stars, label: t.facts.stars }] : []),
  ];
  const entries = catalogEntries(locale, (name) => format(all.docs.ia.catalog.preview, { name }));
  const families = catalogFamilies(entries, FILTER_KEYS);
  const titleOf = (key: string) =>
    (JOBS as readonly string[]).includes(key) ? all.docs.ia.jobs[key as (typeof JOBS)[number]].title : (PATTERNS as readonly string[]).includes(key) ? all.docs.ia.patterns[key as (typeof PATTERNS)[number]].title : all.docs.ia.groups.templates.title;
  const playable = Object.keys(PLAYGROUNDS) as (keyof typeof PLAYGROUNDS)[];

  return (
    <div className="kz-home not-prose">
      <HomeStudio
        words={{ ...t.dock, browse: format(t.dock.browse, { count }), start: t.start, startHref: localePath(locale, "/installation"), browseHref: localePath(locale, "/components") }}
        lead={
            <header className="kz-home-hero">
              <div className="kz-home-hero-text">
                <p className="kz-land-eyebrow">{t.eyebrow}</p>
                <h1>{t.title}</h1>
                <p className="kz-land-lead">{format(t.lead, { count })}</p>
                <div className="kz-home-install" aria-label={t.install}>
                  <CodeBlock code={WEB_INSTALL} language="bash" copyLabel={t.copy} copiedLabel={t.copied} />
                </div>
                <div className="kz-home-actions">
                  <Button asChild variant="primary" size="lg">
                    <Link href={localePath(locale, "/installation")}>{t.start}</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href={localePath(locale, "/components")}>{format(t.dock.browse, { count })}</Link>
                  </Button>
                </div>
                <dl className="kz-land-figures">
                  {figures.map((f) => (
                    <div key={f.id} data-figure={f.id}>
                      <dt>{f.label}</dt>
                      <dd>
                        <NumberTicker value={f.value} locale={locale} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <HeroKit words={t.kit} />
            </header>
        }
      >
        <section className="kz-home-scene" id="scene" aria-label={t.scene.parts}>
          <SceneSweep />
          <ProductScene />
          <p className="kz-home-note">{t.scene.parts}</p>
        </section>

        <section className="kz-home-section" aria-labelledby="home-play">
          <h2 id="home-play">{t.play.title}</h2>
          <p className="kz-land-sub">{t.play.lead}</p>
          <TabsRoot defaultValue="button" variant="pills" className="kz-home-play">
            <TabsList aria-label={t.play.pick}>
              {playable.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {getRegistryItem(name).title}
                </TabsTrigger>
              ))}
            </TabsList>
            {playable.map((name) => (
              <TabsContent key={name} value={name}>
                <PlayStage item={getRegistryItem(name)} locale={locale} />
              </TabsContent>
            ))}
          </TabsRoot>
        </section>

        <section className="kz-home-section" aria-labelledby="home-families">
          <div className="kz-home-head">
            <div>
              <h2 id="home-families">{t.families.title}</h2>
              <p className="kz-land-sub">{t.families.lead}</p>
            </div>
            <Link className="kz-home-more" href={localePath(locale, "/components")}>
              {format(t.families.all, { count })} →
            </Link>
          </div>
          <FamilyCards families={families} titles={Object.fromEntries(families.map((family) => [family.key, titleOf(family.key)]))} hrefs={Object.fromEntries(families.map((family) => [family.key, `${localePath(locale, "/components")}?group=${family.key}#catalog-list`]))} />
        </section>
      </HomeStudio>

      <section className="kz-home-section" aria-labelledby="land-packages">
        <h2 id="land-packages">{t.packages.title}</h2>
        <div className="kz-land-install" aria-label={t.install}>
          <CodeBlock code={WEB_INSTALL} language="bash" copyLabel={t.copy} copiedLabel={t.copied} />
        </div>
        <ul className="kz-land-packages">
          {PACKAGES.map((p) => (
            <li key={p.name}>
              <Link href={localePath(locale, p.path ?? "/")}>
                <code>{p.name}</code>
              </Link>
              <span>{about.get(p.dir)}</span>
              {downloads.get(p.name) ? (
                <span className="kz-land-downloads">
                  {downloads.get(p.name)?.series ? <Sparkline data={downloads.get(p.name)?.series ?? []} variant="area" width={96} height={24} title={`${p.name} — ${t.packages.trend}`} /> : null}
                  {format(t.packages.weekly, { count: new Intl.NumberFormat(locale).format(downloads.get(p.name)?.weekly ?? 0) })}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="kz-land-sub">
          <a href="https://github.com/krizaka/krizaka-ui">{t.packages.source} →</a>
        </p>
      </section>

      <section className="kz-home-section" aria-labelledby="land-family">
        <h2 id="land-family">{t.family.title}</h2>
        <p className="kz-land-sub">{t.family.lead}</p>
        <CardGrid min={240} columns={3}>
          {familyLinks("ui").map((site) => (
            <LinkCard key={site.id} href={site.url} title={site.name} description={familyLabels[locale].descriptions[site.id]} meta={site.host} />
          ))}
        </CardGrid>
      </section>
    </div>
  );
}
