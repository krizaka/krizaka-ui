"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactNode, useContext } from "react";

import { useI18n } from "../I18nProvider";
import { BuilderScreen } from "./BuilderScreen";

/* The editor is a separate chunk, fetched in the browser only: the page's text and its install line paint first, the
   editor (the canvas, the drag and drop, ~600 kB) arrives after. */
const BuilderDemo = dynamic(() => import("./BuilderDemo"), { ssr: false, loading: () => <EditorPlaceholder /> });

/* The title above the editor, for the placeholder too: the screen keeps its shape while the editor loads. */
const HeadContext = createContext<ReactNode>(null);

function EditorPlaceholder() {
  const { t } = useI18n();
  return (
    <BuilderScreen head={useContext(HeadContext)}>
      <output className="kz-builder-slot grid place-items-center border border-border-default bg-surface-sunken text-fg-secondary">{t.site.builder.loading}</output>
    </BuilderScreen>
  );
}

/** `head` is what sits above the editor on the first screen (the page's title, server-rendered). */
export function BuilderDemoLoader({ head }: Readonly<{ head: ReactNode }>) {
  return (
    <HeadContext.Provider value={head}>
      <BuilderDemo head={head} />
    </HeadContext.Provider>
  );
}
