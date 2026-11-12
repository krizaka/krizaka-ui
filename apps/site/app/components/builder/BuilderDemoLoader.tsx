"use client";

import dynamic from "next/dynamic";

import { useI18n } from "../I18nProvider";

/* The editor is a separate chunk, fetched in the browser only: the page's text and its install line paint first, the
   editor (the canvas, the drag and drop, ~600 kB) arrives after. */
const BuilderDemo = dynamic(() => import("./BuilderDemo"), { ssr: false, loading: () => <EditorPlaceholder /> });

function EditorPlaceholder() {
  const { t } = useI18n();
  return (
    <div role="status" className="grid min-h-[480px] place-items-center rounded-xl border border-border-default bg-surface-sunken text-fg-secondary">
      {t.site.builder.loading}
    </div>
  );
}

export function BuilderDemoLoader() {
  return <BuilderDemo />;
}
