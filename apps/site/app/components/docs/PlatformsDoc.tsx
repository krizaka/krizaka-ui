import { format, getDictionary, type Locale } from "@/lib/i18n";
import { getRegistryItems, type ParityCell } from "@/lib/ui-registry";
import { componentPath, localePath } from "@/lib/urls";

import { NATIVE_INSTALL, WEB_CSS, WEB_INSTALL } from "./ComponentDoc";
import { CodeBlock } from "./ExamplePreview";
import { type MatrixRow, PlatformsMatrix } from "./PlatformsMatrix";

const PLATFORMS = ["web", "native", "desktop"] as const;
type PlatformId = (typeof PLATFORMS)[number];

const DESKTOP_INSTALL = `npm create tauri-app@latest   # React + TypeScript
${WEB_INSTALL}`;
const DESKTOP_CODE = `// The window: the title bar moves it, no drawer, the desktop's density (ADR-002).
<AppShell.Root desktop>…</AppShell.Root>

// tauri.conf.json → app.windows[0]
{ "titleBarStyle": "Overlay", "hiddenTitle": true, "minWidth": 960 }`;
const NATIVE_CODE = `import { ThemeProvider, Button } from "@krizaka/ui/native";

<ThemeProvider>
  <Button variant="primary" label="Continue" />
</ThemeProvider>`;

/** How many components are there (✓), missing and tracked (✗), not meant for it (n/a), per platform. */
function countsOf(rows: MatrixRow[]) {
  const counts = Object.fromEntries(PLATFORMS.map((p) => [p, { yes: 0, gap: 0, na: 0 }])) as Record<PlatformId, { yes: number; gap: number; na: number }>;
  const bucket = (cell: ParityCell) => (cell.state === "gap" ? "gap" : cell.state === "n/a" ? "na" : "yes");
  for (const row of rows) for (const p of PLATFORMS) counts[p][bucket(row[p])] += 1;
  return counts;
}

/* /platforms — web · mobile · desktop: what each platform is, how to install it, and the parity matrix of every component,
   generated from the `parity` of each meta (krizaka-ui tools/parity.mjs). Never written here. */
export function PlatformsDoc({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.ia.platforms;
  const rows: MatrixRow[] = getRegistryItems()
    .filter((item) => item.parity)
    .map((item) => ({ name: item.name, title: item.title, href: componentPath(locale, item.name), web: item.parity.web, native: item.parity.native, desktop: item.parity.desktop }));
  const counts = countsOf(rows);
  const code: Record<PlatformId, { install: string; use: string; lang: string }> = {
    web: { install: WEB_INSTALL, use: WEB_CSS, lang: "css" },
    native: { install: NATIVE_INSTALL, use: NATIVE_CODE, lang: "tsx" },
    desktop: { install: DESKTOP_INSTALL, use: DESKTOP_CODE, lang: "tsx" },
  };
  return (
    <div>
      <p>{t.intro}</p>
      <div className="kz-platforms not-prose">
        {PLATFORMS.map((p) => (
          <section key={p} className="kz-platform" aria-labelledby={`platform-${p}`}>
            <h2 id={`platform-${p}`}>{t.cards[p].title}</h2>
            <p className="kz-platform-what">{t.cards[p].what}</p>
            <p className="kz-platform-count">{format(t.count, { yes: counts[p].yes, gap: counts[p].gap, na: counts[p].na })}</p>
            <p className="kz-platform-step">{t.install}</p>
            <CodeBlock code={code[p].install} lang="bash" />
            <p className="kz-platform-step">{t.cards[p].use}</p>
            <CodeBlock code={code[p].use} lang={code[p].lang} />
          </section>
        ))}
      </div>
      <h2 id="matrix">{t.matrix}</h2>
      <p>{t.matrixLead}</p>
      <p className="kz-docs-note">
        {t.legend} <a href={localePath(locale, "/mobile")}>{t.mobileLink}</a>
      </p>
      <PlatformsMatrix rows={rows} labels={{ caption: t.caption, component: t.component, web: t.cards.web.title, native: t.cards.native.title, desktop: t.cards.desktop.title, states: t.states, issue: t.issue }} />
    </div>
  );
}
