// Client (the copy button, the tabs). A sample of code (blocks.css): its language and its file name, the code
// highlighted (it scrolls sideways, never shrinks, and takes the keyboard's focus to scroll), a copy button that says
// it copied in a polite live region. CodeTabs puts several ways to write the same thing (Maven · Gradle · npm) under
// the tabs of @krizaka/ui.
import * as React from "react";

import { cn } from "../cn";
import { CheckGlyph, CopyGlyph } from "../glyphs";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "../tabs/tabs";
import { highlight } from "./highlight";

export type CodeBlockProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The code, as it is copied. */
  code: string;
  /** Its language, shown as a tag and used by the highlighter: `xml`, `kotlin`, `ts`, `bash`, `yaml`… */
  language?: string;
  /** The file it belongs in (`pom.xml`, `application.yml`), or what it is (`Terminal`). */
  file?: React.ReactNode;
  /** The copy button's words. */
  copyLabel: string;
  /** What the button says once the code is copied (announced politely). */
  copiedLabel: string;
  /**
   * Colours comments, strings, annotations, tags and keywords (the tokens' roles).
   * @default true
   */
  highlight?: boolean;
  /** Called after the code is copied. */
  onCopy?: () => void;
};

/** A code sample: language and file name, highlighted code that scrolls sideways, a copy button. */
export function CodeBlock({ code, language = "text", file, copyLabel, copiedLabel, highlight: colour = true, onCopy, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = () =>
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      onCopy?.();
    });
  return (
    <figure className={cn("kz-code", className)} {...props}>
      <figcaption className="kz-code-bar">
        <span className="kz-code-file">
          {language !== "text" && <span className="kz-code-lang">{language}</span>}
          {file}
        </span>
        <button type="button" className="kz-code-copy" onClick={copy} data-copied={copied ? "" : undefined}>
          {copied ? <CheckGlyph className="h-3.5 w-3.5" /> : <CopyGlyph className="h-3.5 w-3.5" />}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code data-language={language}>{colour ? highlight(code, language) : code}</code>
      </pre>
    </figure>
  );
}

export type CodeTabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "dir" | "defaultValue"> & {
  /** What the tabs choose between (`Build tool`): the tab list's accessible name. */
  label: string;
  /** The ways to write it: an id, the tab's words, its sample (a `CodeBlock`). */
  tabs: readonly { id: string; label: React.ReactNode; content: React.ReactNode }[];
  /** The tab open at first. Defaults to the first one. */
  defaultValue?: string;
};

/** Several ways to write the same thing (Maven · Gradle · npm): segmented tabs above code samples. */
export function CodeTabs({ label, tabs, defaultValue, className, ...props }: CodeTabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? tabs[0]?.id} variant="segmented" className={cn("kz-code-tabs", className)} {...props}>
      <TabsList aria-label={label}>
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id}>
          {t.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
