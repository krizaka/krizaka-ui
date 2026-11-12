"use client";

/* The editor of /builder, loaded on demand (BuilderDemoLoader): @krizaka/ui-builder's Puck canvas with the demo's blocks, the
   content-language switch, the document it writes and the three attacks. Nothing is stored: the page is React state. The
   stylesheet is the `no-external` build of the editor's: it asks no font from another site. */

import "@krizaka/ui-builder/no-external.css";

import { Button } from "@krizaka/ui/button";
import { type Data, Puck } from "@krizaka/ui-builder";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  attack,
  type AttackId,
  ATTACKS,
  checkDocument,
  CONTENT_LOCALES,
  type ContentLocale,
  describeIssue,
  documentJson,
  missingTranslations,
  type PageData,
  starterPage,
  toDocument,
} from "@/lib/builder-demo";
import { format } from "@/lib/i18n";

import { useI18n } from "../I18nProvider";
import { useSiteTheme } from "../SiteTheme";
import { createConfig } from "./builder-config";
import { ContentLocaleContext } from "./ContentLocale";

const DOCUMENT_SCHEMA = 2;

/* The canvas is an iframe with its own <html>: it takes the site's light class, or the blocks would stay dark. Nothing is
   saved, so the header keeps undo and redo and drops Publish. */
function ThemedFrame({ children, document: frame }: Readonly<{ children: ReactNode; document?: Document }>) {
  const { theme } = useSiteTheme();
  const { t } = useI18n();
  useEffect(() => {
    frame?.defaultView?.frameElement?.setAttribute("title", t.site.builder.editorRegion);
    frame?.documentElement.classList.toggle("light", theme === "light");
  }, [frame, theme, t]);
  return <>{children}</>;
}

const OVERRIDES = { headerActions: () => <></>, iframe: ThemedFrame };

export default function BuilderDemo() {
  const { t, locale } = useI18n();
  const b = t.site.builder;
  const [data, setData] = useState<PageData>(starterPage);
  const [content, setContent] = useState<ContentLocale>(locale);
  const [picked, setPicked] = useState<AttackId | null>(null);

  const config = useMemo(() => createConfig(b.editor), [b.editor]);
  // Desktop first: the canvas opens at the page's full width, the phone is one click away.
  const viewports = useMemo(
    () => [
      { width: "100%" as const, height: "auto" as const, label: b.editor["viewport-desktop"], icon: "Monitor" as const },
      { width: 390, height: "auto" as const, label: b.editor["viewport-phone"], icon: "Smartphone" as const },
    ],
    [b.editor],
  );
  const doc = useMemo(() => toDocument(data), [data]);
  const verdict = useMemo(() => checkDocument(doc), [doc]);
  const missing = useMemo(() => missingTranslations(doc, "fr"), [doc]);
  const outcome = useMemo(() => (picked ? checkDocument(attack(picked, doc)) : null), [picked, doc]);
  const attackLine = outcome?.ok ? b.attacks.accepted : outcome && b.attacks.refused;
  const shown = picked ? JSON.stringify(attack(picked, doc), null, 2) : documentJson(doc);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <fieldset className="m-0 flex items-center gap-2 border-0 p-0">
          <legend className="float-left mr-2 p-0 text-sm font-medium text-fg-secondary">{b.language.label}</legend>
          {CONTENT_LOCALES.map((code) => (
            <Button key={code} type="button" size="sm" variant={content === code ? "primary" : "secondary"} aria-pressed={content === code} lang={code} onClick={() => setContent(code)}>
              {b.language[code]}
            </Button>
          ))}
        </fieldset>
        <p className="text-sm text-fg-secondary">{b.language.hint}</p>
      </div>

      <section aria-label={b.editorRegion} className="kz-builder-editor overflow-hidden rounded-xl border border-border-default">
        <ContentLocaleContext.Provider value={content}>
          <Puck
            config={config}
            data={data as Data}
            onChange={(next) => setData(next as PageData)}
            dictionary={b.editor}
            ui={{ itemSelector: { index: 0, zone: "root:default-zone" } }}
            iframe={{ enabled: true, waitForStyles: false }}
            viewports={viewports}
            height="min(80vh, 760px)"
            headerTitle={b.eyebrow}
            overrides={OVERRIDES}
          />
        </ContentLocaleContext.Provider>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="builder-document" className="grid content-start gap-3">
          <h2 id="builder-document" className="text-xl font-bold text-fg">
            {b.document.title}
          </h2>
          <p className="text-fg-secondary">{format(b.document.lead, { schema: DOCUMENT_SCHEMA })}</p>
          <output className={`block text-sm font-semibold ${verdict.ok ? "text-fg-success" : "text-fg-danger"}`}>
            {verdict.ok ? format(b.document.valid, { blocks: doc.blocks.length }) : format(b.document.invalid, { count: verdict.issues.length })}
          </output>
          <pre tabIndex={0} aria-label={b.document.jsonLabel} className="max-h-96 overflow-auto rounded-lg border border-border-default bg-surface-sunken p-4 text-xs text-fg">
            <code>{shown}</code>
          </pre>
        </section>

        <div className="grid content-start gap-8">
          <section aria-labelledby="builder-attacks" className="grid gap-3">
            <h2 id="builder-attacks" className="text-xl font-bold text-fg">
              {b.attacks.title}
            </h2>
            <p className="text-fg-secondary">{b.attacks.lead}</p>
            <div className="flex flex-wrap gap-2">
              {ATTACKS.map((id) => (
                <Button key={id} type="button" size="sm" variant={picked === id ? "primary" : "secondary"} aria-pressed={picked === id} onClick={() => setPicked(id)}>
                  {b.attacks[id]}
                </Button>
              ))}
              {picked && (
                <Button type="button" size="sm" variant="ghost" onClick={() => setPicked(null)}>
                  {b.attacks.clear}
                </Button>
              )}
            </div>
            <output className={`block text-sm font-semibold ${outcome?.ok ? "text-fg-danger" : "text-fg-success"}`}>{attackLine}</output>
            {outcome && !outcome.ok && (
              <ul aria-label={b.attacks.resultLabel} className="grid gap-1">
                {outcome.issues.map((issue) => (
                  <li key={`${issue.path}-${issue.code}`} className="break-words rounded-md border border-border-default bg-surface-sunken px-3 py-2 font-mono text-xs text-fg">
                    {describeIssue(issue)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="builder-missing" className="grid gap-3">
            <h2 id="builder-missing" className="text-xl font-bold text-fg">
              {b.missing.title}
            </h2>
            <output className="block text-fg-secondary">
              {missing.length === 0 ? format(b.missing.none, { language: b.missing.language }) : format(b.missing.some, { count: missing.length, language: b.missing.language })}
            </output>
            {missing.length > 0 && (
              <ul className="grid gap-1">
                {missing.map((path) => (
                  <li key={path} className="break-words rounded-md border border-border-default bg-surface-sunken px-3 py-2 font-mono text-xs text-fg">
                    {path}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
