import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { CalendarIcon, ForwardIcon, HomeIcon, PackIcon, SettingsIcon, StudioIcon, ThemeIcon, VideoIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock } from "@krizaka/ui/code-block";
import { LinkCard } from "@krizaka/ui/link-card";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import Link from "next/link";
import type { ComponentType } from "react";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { getRegistryItem, getRegistryItems } from "@/lib/ui-registry";
import { componentPath, localePath } from "@/lib/urls";

import { IdentityStage } from "./IdentityStage";

/* The home of ui.krizaka.com: what Krizaka UI is (one sentence, the install line, two ways in, the figures read from the
   registries), a showcase of live components in context under a switchable identity, the ways into the docs, and where
   each package lives. Every component on it is a named example of the registry — the same code its page shows. */

/** The showcase: one example per component, never two of the same, laid out on a four-column grid (`area`). */
const TILES: { key: UiExampleKey; component: string; caption: keyof ReturnType<typeof getDictionary>["landing"]["tiles"]; area: string }[] = [
  { key: "glow-card/plans", component: "glow-card", caption: "plans", area: "plans" },
  { key: "chat/conversation", component: "chat", caption: "chat", area: "chat" },
  { key: "vertical-video/rail", component: "vertical-video", caption: "video", area: "video" },
  { key: "form/sign-up", component: "form", caption: "signUp", area: "form" },
  { key: "stepper/job", component: "stepper", caption: "stepper", area: "stepper" },
  { key: "data-table/jobs", component: "data-table", caption: "jobs", area: "table" },
  { key: "charts/line-chart/creator-earnings", component: "line-chart", caption: "chart", area: "chart" },
];

const PLACES = [
  { id: "start", path: "/installation", Icon: HomeIcon },
  { id: "foundations", path: "/foundations/tokens", Icon: ThemeIcon },
  { id: "components", path: "/components", Icon: StudioIcon },
  { id: "patterns", path: "/components/page-hero", Icon: PackIcon },
  { id: "templates", path: "/templates", Icon: CalendarIcon },
  { id: "mobile", path: "/mobile", Icon: VideoIcon },
  { id: "tooling", path: "/packages/tailwind", Icon: SettingsIcon },
] as const;

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
  { name: "@krizaka/config", path: "/packages/config", dir: "config" },
];

const INSTALL = "npm install @krizaka/ui @krizaka/tailwind @krizaka/tokens tailwindcss";

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
  const t = getDictionary(locale).landing;
  const items = getRegistryItems().filter((item) => item.status !== "deprecated");
  const published = publishedPackages();
  const figures = [
    { id: "components", value: items.length, label: t.facts.components },
    { id: "native", value: items.filter((item) => item.platforms !== "web").length, label: t.facts.native },
    { id: "packages", value: published.length, label: t.facts.packages },
  ];
  const tiles = await Promise.all(
    TILES.map(async (tile) => ({ ...tile, title: getRegistryItem(tile.component).title, Example: (await UI_EXAMPLES[tile.key]()).default as ComponentType<Record<string, unknown>> })),
  );
  const about = new Map(published.map((p) => [p.dir, p.description]));

  return (
    <div className="kz-land not-prose">
      <header className="kz-land-hero">
        <p className="kz-land-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="kz-land-lead">{t.lead}</p>
        <div className="kz-land-install" aria-label={t.install}>
          <CodeBlock code={INSTALL} language="bash" copyLabel={t.copy} copiedLabel={t.copied} />
        </div>
        <div className="kz-land-actions">
          <Button asChild variant="primary" size="lg" shape="cut" shimmer>
            <Link href={localePath(locale, "/installation")}>
              {t.start} <ForwardIcon size={16} aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" shape="cut">
            <Link href={localePath(locale, "/components")}>{t.browse}</Link>
          </Button>
        </div>
        <dl className="kz-land-figures">
          {figures.map((f) => (
            <div key={f.id}>
              <dt>{f.label}</dt>
              <dd>
                <NumberTicker value={f.value} locale={locale} />
              </dd>
            </div>
          ))}
          <div>
            <dt>{t.facts.version}</dt>
            <dd className="kz-land-version">{packageVersion("ui")}</dd>
          </div>
        </dl>
      </header>

      <section className="kz-land-section" aria-labelledby="land-showcase">
        <h2 id="land-showcase">{t.showcase.title}</h2>
        <p className="kz-land-sub">{t.showcase.lead}</p>
        <IdentityStage label={t.showcase.identity} stageLabel={t.showcase.stage}>
          {tiles.map(({ key, component, caption, area, title, Example }) => (
            <figure key={key} className="kz-land-tile" data-area={area}>
              <div className="kz-land-stage">
                <Example {...examplePropsOf(key)} />
              </div>
              <figcaption>
                <span>{t.tiles[caption]}</span>
                <Link href={componentPath(locale, component)} aria-label={format(t.showcase.open, { name: title })}>
                  {title} →
                </Link>
              </figcaption>
            </figure>
          ))}
        </IdentityStage>
      </section>

      <section className="kz-land-section" aria-labelledby="land-find">
        <h2 id="land-find">{t.find.title}</h2>
        <p className="kz-land-sub">{t.find.lead}</p>
        <CardGrid min={240} reveal={false}>
          {PLACES.map(({ id, path: to, Icon }) => (
            <LinkCard key={id} href={localePath(locale, to)} linkAs={Link} icon={<Icon size={22} aria-hidden />} title={t.places[id].title} description={t.places[id].text} />
          ))}
        </CardGrid>
      </section>

      <section className="kz-land-section" aria-labelledby="land-packages">
        <h2 id="land-packages">{t.packages.title}</h2>
        <ul className="kz-land-packages">
          {PACKAGES.map((p) => (
            <li key={p.name}>
              <Link href={localePath(locale, p.path ?? "/")}>
                <code>{p.name}</code>
              </Link>
              <span>{about.get(p.dir)}</span>
            </li>
          ))}
        </ul>
        <p className="kz-land-sub">
          <a href="https://github.com/krizaka/krizaka-ui">{t.packages.source} →</a>
        </p>
      </section>
    </div>
  );
}
