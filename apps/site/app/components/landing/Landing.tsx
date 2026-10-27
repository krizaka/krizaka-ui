import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { CardBody, CardDescription, CardRoot, CardTitle } from "@krizaka/ui/card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock } from "@krizaka/ui/code-block";
import { Field, Input } from "@krizaka/ui/field";
import { LinkCard } from "@krizaka/ui/link-card";
import { familyLabels } from "@krizaka/ui/sites";
import Link from "next/link";

import { familyLinks } from "@/lib/family-links";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { WEB_INSTALL } from "@/lib/install";
import { npmDownloads } from "@/lib/npm-downloads";
import { getRegistryItems } from "@/lib/ui-registry";
import { localePath } from "@/lib/urls";

import { HomeSearch } from "./HomeSearch";

/* The home of ui.krizaka.com — the calmest page of the family (Cahier, ADR-004; peer review, krizaka-ui#434: « very AI
   and overloaded »). The first screen holds four things and nothing more: what it is (one title, one line), the install
   line, the three ways in (components, foundations, templates) and the search. Under it, quietly: where each package
   lives, and the rest of the family. No counters, no live kit, no scene, no playground: each component's page has its
   own stage. On a wide screen the right half holds ONE figure (krizaka-ui#417, Cahier): a plate of four specimens
   drawn by the kit itself — server-rendered, still, inert — each with its figure number. Under the text on a phone and a
   tablet. Checked by tests/home.test.mjs and, in a browser, scripts/home-geometry.mjs. */

const WAYS = [
  { id: "components", path: "/components" },
  { id: "foundations", path: "/foundations/tokens" },
  { id: "templates", path: "/templates" },
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
  { name: "@krizaka/app-config", path: "/packages/app-config", dir: "app-config" },
];

/** A package's description, cut to its first clause (before a colon or a full stop), at most ~90 characters. */
function short(text: string): string {
  const clause = text.split(/:\s|(?<=\.)\s/)[0] ?? "";
  if (clause.length <= 90) return clause.replace(/\.$/, "");
  return `${clause.slice(0, 88).replace(/\s+\S*$/, "")}…`;
}

/** The descriptions of the workspace packages published on npm (not private). */
function descriptions(): Map<string, string> {
  const root = path.join(process.cwd(), "..", "..", "packages");
  return new Map(
    readdirSync(root).flatMap((dir) => {
      try {
        const pkg = JSON.parse(readFileSync(path.join(root, dir, "package.json"), "utf8")) as { private?: boolean; description?: string };
        return pkg.private ? [] : [[dir, short(pkg.description ?? "")] as [string, string]];
      } catch {
        return [];
      }
    }),
  );
}

/** Plate I: four real pieces of the kit, drawn here by the kit, numbered like the plates of a field guide. */
function Sheet({ sheet }: { sheet: ReturnType<typeof getDictionary>["landing"]["sheet"] }) {
  const figures = [
    {
      key: "button",
      caption: sheet.button,
      specimen: (
        <Button variant="primary" tabIndex={-1}>
          {sheet.buttonLabel}
        </Button>
      ),
    },
    {
      key: "field",
      caption: sheet.field,
      specimen: (
        <Field.Root>
          <Field.Label htmlFor="sheet-email">{sheet.fieldLabel}</Field.Label>
          <Input id="sheet-email" type="email" tabIndex={-1} aria-describedby="sheet-email-hint" placeholder={sheet.fieldPlaceholder} />
          <Field.Hint id="sheet-email-hint">{sheet.fieldHint}</Field.Hint>
        </Field.Root>
      ),
    },
    {
      key: "badge",
      caption: sheet.badge,
      specimen: (
        <span className="kz-sheet-row">
          <Badge tone="success" dot>
            {sheet.badgeStable}
          </Badge>
          <Badge tone="accent">{sheet.badgeNew}</Badge>
        </span>
      ),
    },
    {
      key: "card",
      caption: sheet.card,
      specimen: (
        <CardRoot>
          <CardBody>
            <CardTitle as="h3">{sheet.cardTitle}</CardTitle>
            <CardDescription>{sheet.cardText}</CardDescription>
          </CardBody>
        </CardRoot>
      ),
    },
  ];
  return (
    <figure className="kz-sheet" aria-labelledby="kz-sheet-title">
      <figcaption className="kz-sheet-head">
        <span id="kz-sheet-title" className="kz-sheet-title">
          {sheet.title}
        </span>
        <span className="kz-sheet-sub">{sheet.subtitle}</span>
      </figcaption>
      <ol className="kz-sheet-figures">
        {figures.map((f, i) => (
          <li key={f.key} className="kz-sheet-figure">
            <div className="kz-sheet-specimen" aria-hidden inert>
              {f.specimen}
            </div>
            <p className="kz-sheet-caption">
              <b>
                {sheet.figure} {i + 1}
              </b>{" "}
              — {f.caption}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export async function Landing({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).landing;
  const count = getRegistryItems().filter((item) => item.status !== "deprecated").length;
  const about = descriptions();
  // Read from api.npmjs.org at build; a package whose downloads could not be read says nothing (lib/npm-downloads.ts).
  const downloads = await npmDownloads(PACKAGES.map((p) => p.name));

  return (
    <div className="kz-home not-prose">
      <header className="kz-home-hero">
        <h1>{t.title}</h1>
        <p className="kz-land-lead">{format(t.lead, { count })}</p>
        <div className="kz-home-install" aria-label={t.install}>
          <CodeBlock code={WEB_INSTALL} language="bash" copyLabel={t.copy} copiedLabel={t.copied} />
        </div>
        <HomeSearch label={t.search.label} placeholder={t.search.placeholder} />
        <nav className="kz-home-ways" aria-label={t.ways.label}>
          <CardGrid min={200} columns={3} fit="fit" reveal={false}>
            {WAYS.map((w) => (
              <LinkCard key={w.id} href={localePath(locale, w.path)} title={t.ways[w.id].title} description={format(t.ways[w.id].description, { count })} titleAs="h2" linkAs={Link} />
            ))}
          </CardGrid>
        </nav>
        <Sheet sheet={t.sheet} />
      </header>

      <section className="kz-home-section" aria-labelledby="land-packages">
        <h2 id="land-packages">{t.packages.title}</h2>
        <ul className="kz-land-packages">
          {PACKAGES.map((p) => (
            <li key={p.name}>
              <Link href={localePath(locale, p.path ?? "/")}>
                <code>{p.name}</code>
              </Link>
              <span>{about.get(p.dir)}</span>
              {downloads.get(p.name) ? <span className="kz-land-downloads">{format(t.packages.weekly, { count: new Intl.NumberFormat(locale).format(downloads.get(p.name)?.weekly ?? 0) })}</span> : null}
            </li>
          ))}
        </ul>
        <p className="kz-land-sub">
          <a href="https://github.com/krizaka/krizaka-ui">{t.packages.source} →</a>
        </p>
      </section>

      <section className="kz-home-section" aria-labelledby="land-family">
        <h2 id="land-family">{t.family.title}</h2>
        <CardGrid min={240} columns={3}>
          {familyLinks("ui").map((site) => (
            <LinkCard key={site.id} href={site.url} title={site.name} description={familyLabels[locale].descriptions[site.id]} meta={site.host} />
          ))}
        </CardGrid>
      </section>
    </div>
  );
}
