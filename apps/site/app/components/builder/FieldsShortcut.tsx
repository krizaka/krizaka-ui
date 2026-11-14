"use client";

import { SkipLink } from "@krizaka/ui/skip-link";

import { focusFirstField } from "@/lib/builder-focus";

import { useI18n } from "../I18nProvider";

/* The first tab stop of the workspace page, before the site's bar: one key to the first field of the selected block
   (the bar, the panels and the canvas come before it otherwise). Until the editor has loaded it leads to the editor's
   region. */
export function FieldsShortcut() {
  const { t } = useI18n();
  const b = t.site.builder;
  return (
    <SkipLink
      href="#builder-editor"
      onClick={(event) => {
        if (focusFirstField(document.querySelector(".kz-builder-editor"), b.editor["plugin-fields"])) event.preventDefault();
      }}
    >
      {b.toFields}
    </SkipLink>
  );
}
