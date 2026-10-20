"use client";

import { MoonIcon, SunIcon } from "@krizaka/icons";
import { cn } from "@krizaka/ui/cn";
import { Tabs } from "@krizaka/ui/tabs";
import { type ReactNode,useState } from "react";

import { useI18n } from "../I18nProvider";

/* The frame of a live preview: Preview / Code tabs (@krizaka/ui, segmented), and a theme switch that applies to the
   frame only (`.theme-light` / `.theme-dark` of @krizaka/tokens re-declare the values on the subtree). Until it is
   pressed the stage follows the page's theme by inheritance, and CSS shows the right glyph (html.light): the frame reads
   no theme hook, so nothing re-renders it before its example (LiveExample) has hydrated — an update there made React
   throw the server's HTML away and render every example again (tests/route-weight.test.mjs). */
export function PreviewFrame({ label, code, children, stageClassName = "" }: { label: string; code: ReactNode; children: ReactNode; stageClassName?: string }) {
  const { t } = useI18n();
  const text = t.docs.preview;
  const [frameTheme, setFrameTheme] = useState<"light" | "dark" | null>(null);
  const [tab, setTab] = useState("preview");
  // The theme shown, read when the switch is pressed: the frame's own, else the page's.
  const shown = () => frameTheme ?? (document.documentElement.classList.contains("light") ? "light" : "dark");

  return (
    <Tabs.Root
      variant="segmented"
      value={tab}
      onValueChange={setTab}
      role="group"
      aria-label={label}
      className="kz-preview not-prose gap-0"
    >
      <div className="kz-preview-bar">
        <Tabs.List aria-label={label}>
          <Tabs.Trigger value="preview">{text.preview}</Tabs.Trigger>
          <Tabs.Trigger value="code">{text.code}</Tabs.Trigger>
        </Tabs.List>
        {tab === "preview" && (
          <button
            type="button"
            className="kz-preview-theme"
            data-shown={frameTheme ?? undefined}
            onClick={() => setFrameTheme(shown() === "dark" ? "light" : "dark")}
            aria-label={text.switchTheme}
            title={text.switchTheme}
          >
            <SunIcon size={14} className="kz-preview-to-light" aria-hidden />
            <MoonIcon size={14} className="kz-preview-to-dark" aria-hidden />
          </button>
        )}
      </div>
      <Tabs.Content value="preview" className={cn("kz-preview-stage rounded-none", frameTheme && "theme-" + frameTheme, stageClassName)}>
        {children}
      </Tabs.Content>
      <Tabs.Content value="code" className="kz-preview-code rounded-none">
        {code}
      </Tabs.Content>
    </Tabs.Root>
  );
}
