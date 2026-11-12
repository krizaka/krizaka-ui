"use client";

/* The editor's config, built from the same BLOCKS object the validator reads (lib/builder-demo.ts): a `localized` field
   is one text box for the language being written, an `enum` a choice, a `slot` a drop zone. The blocks themselves are
   @krizaka/ui's (Button, Card, CtaPanel). */

import { Button } from "@krizaka/ui/button";
import { CardBody, CardDescription, CardRoot, CardTitle } from "@krizaka/ui/card";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { type Config, type Field } from "@krizaka/ui-builder";
import type { FieldDef } from "@krizaka/ui-builder/document";
import type { ReactNode } from "react";

import { BLOCKS, type BlockType, DEFAULT_CONTENT_LOCALE, wordsFor } from "@/lib/builder-demo";
import type { TranslationDictionary } from "@/lib/i18n";

import { useContentLocale } from "./ContentLocale";

export type EditorMessages = TranslationDictionary["site"]["builder"];
type Labels = EditorMessages["editor"];
type LabelKey = keyof Labels;
const label = (labels: Labels, key: string): string => labels[key as LabelKey] ?? key;

/** The words of a field, in the language being written; a French text that is missing is shown in English and marked. */
function Words({ value }: { value: unknown }) {
  const locale = useContentLocale();
  const { text, fallback } = wordsFor(value, locale);
  return fallback ? (
    <span data-fallback="" className="underline decoration-dashed decoration-warning underline-offset-4">
      {text}
    </span>
  ) : (
    <>{text}</>
  );
}

const INPUT_CLASS = "w-full rounded-md border border-border-default bg-surface-sunken px-3 py-2 text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2";

function LocalizedInput({ value, onChange, long, id, name }: { value: Record<string, string> | undefined; onChange: (next: Record<string, string>) => void; long: boolean; id: string; name: string }) {
  const locale = useContentLocale();
  const own = value?.[locale] ?? "";
  const change = (text: string) => {
    const others = Object.fromEntries(Object.entries(value ?? {}).filter(([code]) => code !== locale));
    // A cleared text leaves the language's key out: that is what « missing » means to the document.
    onChange(text === "" && locale !== DEFAULT_CONTENT_LOCALE ? others : { ...others, [locale]: text });
  };
  const shared = { id, name, lang: locale, value: own, className: INPUT_CLASS };
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-xs font-medium text-fg-secondary">
        {name} · {locale.toUpperCase()}
      </label>
      {long ? <textarea rows={3} {...shared} onChange={(e) => change(e.target.value)} /> : <input type="text" {...shared} onChange={(e) => change(e.target.value)} />}
    </div>
  );
}

function fieldFor(name: string, def: FieldDef, labels: Labels): Field {
  const common = { label: label(labels, `field-${name}`) };
  switch (def.type) {
    case "localized":
      return {
        ...common,
        type: "custom",
        render: ({ value, onChange, id }) => <LocalizedInput id={id} name={common.label} value={value as Record<string, string> | undefined} onChange={onChange} long={(def.maxLength ?? 0) > 100} />,
      };
    case "enum":
      return { ...common, type: "radio", options: def.options.map((o) => ({ label: label(labels, `${name}-${o}`), value: o })) };
    case "slot":
      return { ...common, type: "slot", allow: def.allow ? [...def.allow] : undefined };
    default:
      throw new Error(`the demo has no editor for a ${def.type} field`);
  }
}

function fieldsOf(type: BlockType, labels: Labels): Record<string, Field> {
  const fields: Readonly<Record<string, FieldDef>> = BLOCKS.blocks[type].fields;
  return Object.fromEntries(Object.entries(fields).map(([name, def]) => [name, fieldFor(name, def, labels)]));
}

const Block = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`px-5 py-8 sm:px-10 ${className}`}>{children}</div>;

export function createConfig(labels: Labels): Config {
  return {
    root: { fields: {} },
    categories: { blocks: { title: label(labels, "plugin-blocks"), components: ["Hero", "Features", "Quote", "CallToAction"], defaultExpanded: true }, other: { visible: false } },
    components: {
      Hero: {
        label: label(labels, "block-Hero"),
        fields: fieldsOf("Hero", labels),
        render: ({ eyebrow, title, lead, primary, secondary, align }) => (
          <Block className={`py-12 sm:py-16 ${align === "center" ? "text-center" : ""}`}>
            <p className="text-sm font-semibold text-fg-accent">
              <Words value={eyebrow} />
            </p>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight text-fg sm:text-5xl" style={align === "center" ? { marginInline: "auto" } : undefined}>
              <Words value={title} />
            </h1>
            <p className="mt-4 max-w-xl text-lg text-fg-secondary" style={align === "center" ? { marginInline: "auto" } : undefined}>
              <Words value={lead} />
            </p>
            <div className={`mt-7 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
              <Button variant="primary" size="lg" type="button">
                <Words value={primary} />
              </Button>
              <Button variant="secondary" size="lg" type="button">
                <Words value={secondary} />
              </Button>
            </div>
          </Block>
        ),
      },
      Features: {
        label: label(labels, "block-Features"),
        fields: fieldsOf("Features", labels),
        render: ({ heading, items: Items }) => (
          <Block>
            <h2 className="text-2xl font-bold text-fg">
              <Words value={heading} />
            </h2>
            <Items className="mt-5 grid gap-4 sm:grid-cols-3" minEmptyHeight={96} />
          </Block>
        ),
      },
      Feature: {
        label: label(labels, "block-Feature"),
        fields: fieldsOf("Feature", labels),
        render: ({ title, body }) => (
          <CardRoot>
            <CardBody>
              <CardTitle as="h3">
                <Words value={title} />
              </CardTitle>
              <CardDescription>
                <Words value={body} />
              </CardDescription>
            </CardBody>
          </CardRoot>
        ),
      },
      Quote: {
        label: label(labels, "block-Quote"),
        fields: fieldsOf("Quote", labels),
        render: ({ text, author }) => (
          <Block>
            <figure className="border-l-4 border-accent pl-5">
              <blockquote className="text-xl font-medium text-fg">
                <Words value={text} />
              </blockquote>
              <figcaption className="mt-3 text-sm text-fg-secondary">
                <Words value={author} />
              </figcaption>
            </figure>
          </Block>
        ),
      },
      CallToAction: {
        label: label(labels, "block-CallToAction"),
        fields: fieldsOf("CallToAction", labels),
        render: ({ title, label: action }) => (
          <Block>
            <CtaPanel title={<Words value={title} />} level={2}>
              <Button variant="primary" type="button">
                <Words value={action} />
              </Button>
            </CtaPanel>
          </Block>
        ),
      },
    },
  };
}
