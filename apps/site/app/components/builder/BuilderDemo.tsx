"use client";

/* The editor of /builder, loaded on demand (BuilderDemoLoader): @krizaka/ui-builder's Puck canvas with the demo's blocks, the
   content-language switch, the document it writes and the three attacks. Nothing is stored: the page is React state. The
   stylesheet is the `no-external` build of the editor's: it asks no font from another site. */

import "@krizaka/ui-builder/no-external.css";

import { Alert } from "@krizaka/ui/alert";
import { Button } from "@krizaka/ui/button";
import { SkipLink } from "@krizaka/ui/skip-link";
import { type Data, Puck } from "@krizaka/ui-builder";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  type AttackId,
  ATTACKS,
  CONTENT_LOCALES,
  type ContentLocale,
  describeIssue,
  documentJson,
  explainFallback,
  explainIssue,
  missingTranslations,
  otherLocale,
  type PageData,
  pluralOf,
  starterPage,
  toDocument,
  verdictOf,
  type VerdictState,
} from "@/lib/builder-demo";
import { format } from "@/lib/i18n";

import { useI18n } from "../I18nProvider";
import { useSiteTheme } from "../SiteTheme";
import { createConfig } from "./builder-config";
import { ContentLocaleContext } from "./ContentLocale";

const DOCUMENT_SCHEMA = 2;

/* The canvas is an iframe with its own <html>: it takes the site's light class, or the blocks would stay dark. Nothing is
   saved, so the header keeps undo and redo and drops Publish. */
/* A block that holds blocks (Features) is a draggable button around other draggable buttons: axe refuses interactive controls
   nested in one (nested-interactive). The nested ones are no longer focusable (a tabindex of -1 still counts as focusable to axe); the outline still reaches each of them. */
function leaveNestedBlocksUnfocusable(frame: Document) {
  const apply = () => frame.querySelectorAll("[data-puck-component] [data-puck-component]").forEach((el) => el.removeAttribute("tabindex"));
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(frame.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["tabindex"] });
  return () => observer.disconnect();
}

function ThemedFrame({ children, document: frame }: Readonly<{ children: ReactNode; document?: Document }>) {
  const { theme } = useSiteTheme();
  const { t } = useI18n();
  useEffect(() => {
    frame?.defaultView?.frameElement?.setAttribute("title", t.site.builder.editorRegion);
    frame?.documentElement.classList.toggle("light", theme === "light");
  }, [frame, theme, t]);
  useEffect(() => (frame ? leaveNestedBlocksUnfocusable(frame) : undefined), [frame]);
  return <>{children}</>;
}

const OVERRIDES = { headerActions: () => <></>, iframe: ThemedFrame };

const TONES = { valid: "success", refused: "danger", "refused-as-expected": "info", accepted: "warning" } as const;

/* The page's default language is the one it is read in; the other one is the one that may be missing. */
const issueClass = "break-words rounded-md border border-border-default bg-surface-sunken px-3 py-2 text-sm text-fg";

export default function BuilderDemo() {
  const { t, locale } = useI18n();
  const b = t.site.builder;
  const defaultLocale: ContentLocale = locale;
  const [data, setData] = useState<PageData>(starterPage);
  const [content, setContent] = useState<ContentLocale>(locale);
  const [picked, setPicked] = useState<AttackId | null>(null);
  const editor = useRef<HTMLElement>(null);
  // The canvas, the panels and the blocks come first in the tab order: this lands on the first field of the selected block
  // (on a phone the fields are a tab of the rail: it is opened first).
  const toFields = () => {
    const root = editor.current;
    if (!root) return;
    const shown = (el: Element) => el.getClientRects().length > 0;
    const first = () => [...root.querySelectorAll<HTMLElement>("input[type=text], textarea")].find(shown);
    const field = first();
    if (field) return field.focus();
    [...root.querySelectorAll("button")].find((button) => button.getAttribute("aria-label") === b.editor["plugin-fields"])?.click();
    requestAnimationFrame(() => first()?.focus());
  };

  const config = useMemo(() => createConfig(b.editor), [b.editor]);
  // Desktop first: the canvas opens at the page's full width, the phone is one click away.
  const viewports = useMemo(
    () => [
      { width: "100%" as const, height: "auto" as const, label: b.editor["viewport-desktop"], icon: "Monitor" as const },
      { width: 390, height: "auto" as const, label: b.editor["viewport-phone"], icon: "Smartphone" as const },
    ],
    [b.editor],
  );
  const doc = useMemo(() => toDocument(data, defaultLocale), [data, defaultLocale]);
  // One verdict, about the JSON the page shows: the attacked copy when an attack is picked, the editor's document otherwise.
  const verdict = useMemo(() => verdictOf(doc, picked), [doc, picked]);
  const missing = useMemo(() => missingTranslations(doc, otherLocale(defaultLocale)), [doc, defaultLocale]);
  const words = useMemo(() => ({ locale, editor: b.editor, report: b.report }), [locale, b.editor, b.report]);
  const languages = useMemo(() => ({ locale: content, defaultLocale }), [content, defaultLocale]);

  return (
    <div className="grid gap-6">
      <SkipLink href="#builder-after">{b.skip}</SkipLink>
      <div className="flex flex-wrap items-center gap-3">
        <fieldset className="m-0 flex items-center gap-2 border-0 p-0">
          <legend className="float-left mr-2 p-0 text-sm font-medium text-fg-secondary">{b.language.label}</legend>
          {CONTENT_LOCALES.map((code) => (
            <Button key={code} type="button" size="sm" variant={content === code ? "primary" : "secondary"} aria-pressed={content === code} lang={code} onClick={() => setContent(code)}>
              {b.language[code]}
            </Button>
          ))}
        </fieldset>
        <Button type="button" size="sm" variant="ghost" onClick={toFields}>
          {b.toFields}
        </Button>
        <p className="text-sm text-fg-secondary">{b.language.hint}</p>
      </div>

      <section ref={editor} aria-label={b.editorRegion} className="kz-builder-editor scroll-mt-28 overflow-hidden rounded-xl border border-border-default">
        <ContentLocaleContext.Provider value={languages}>
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

      <div id="builder-after" tabIndex={-1} className="grid scroll-mt-28 gap-6 outline-none lg:grid-cols-2">
        <section aria-labelledby="builder-document" className="grid content-start gap-3">
          <h2 id="builder-document" className="text-xl font-bold text-fg">
            {b.document.title}
          </h2>
          <p className="text-fg-secondary">{format(b.document.lead, { schema: DOCUMENT_SCHEMA })}</p>
          <Verdict state={verdict.state} blocks={doc.blocks.length} count={verdict.issues.length} />
          <pre tabIndex={0} aria-label={b.document.jsonLabel} className="max-h-96 overflow-auto rounded-lg border border-border-default bg-surface-sunken p-4 text-xs text-fg">
            <code>{documentJson(verdict.shown)}</code>
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
            {verdict.issues.length > 0 && (
              <div className="grid gap-2">
                <ul aria-label={b.attacks.resultLabel} className="grid gap-2">
                  {verdict.issues.map((issue) => (
                    <li key={`${issue.path}-${issue.code}`} className={issueClass}>
                      {explainIssue(issue, doc, words)}
                    </li>
                  ))}
                </ul>
                <details className="text-sm text-fg-secondary">
                  <summary className="cursor-pointer font-medium text-fg">{b.report.rawSummary}</summary>
                  <ul className="mt-2 grid gap-1">
                    {verdict.issues.map((issue) => (
                      <li key={`${issue.path}-${issue.code}`} lang="en" className="break-words font-mono text-xs">
                        {describeIssue(issue)}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </section>

          <section aria-labelledby="builder-missing" className="grid gap-3">
            <h2 id="builder-missing" className="text-xl font-bold text-fg">
              {b.missing.title}
            </h2>
            <output className="block text-fg-secondary">
              {missing.length === 0 ? b.missing.none : format(pluralOf(b.missing.some, missing.length, locale), { count: missing.length })}
            </output>
            {missing.length > 0 && (
              <ul className="grid gap-2">
                {missing.map((path) => (
                  <li key={path} className={issueClass}>
                    {explainFallback(path, doc, words)}
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

/** The one verdict of the page: the validator's answer on the JSON beside it. A refusal is never green. */
function Verdict({ state, blocks, count }: Readonly<{ state: VerdictState | "accepted"; blocks: number; count: number }>) {
  const { t, locale } = useI18n();
  const d = t.site.builder.document;
  const titles: Record<VerdictState | "accepted", string> = {
    valid: format(pluralOf(d.valid, blocks, locale), { blocks }),
    refused: format(pluralOf(d.refused, count, locale), { count }),
    "refused-as-expected": format(pluralOf(d.refusedExpected, count, locale), { count }),
    accepted: t.site.builder.attacks.accepted,
  };
  const notes: Record<VerdictState | "accepted", string | undefined> = { valid: d.validNote, refused: d.refusedNote, "refused-as-expected": d.expectedNote, accepted: undefined };
  return (
    <Alert tone={TONES[state]} title={titles[state]} aria-label={d.verdictTitle}>
      {notes[state]}
    </Alert>
  );
}
