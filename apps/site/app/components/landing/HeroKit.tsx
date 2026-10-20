"use client";

/* The live kit of the home's first screen: a few real components of @krizaka/ui, touchable, under two choices that are
   the real token mechanisms — an identity (`.brand-<id>`, shared with the dock and everything below through
   HomeStudio) and a theme scoped to the kit (`.theme-dark` / `.theme-light`, it starts on the page's theme). The line
   under the kit prints the classes it wears: that is the whole change a product makes. Every word is a message. */

import { ProductLogo } from "@krizaka/ui";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Chip } from "@krizaka/ui/chip";
import { Progress } from "@krizaka/ui/progress";
import { Switch } from "@krizaka/ui/switch";
import { useEffect, useRef, useState } from "react";

import { KIT_IDENTITIES, KIT_THEMES, type KitIdentity, kitScope, type KitTheme } from "@/lib/home-hero";

import { useSiteTheme } from "../SiteTheme";
import { useIdentity } from "./HomeStudio";

const NAMES: Record<KitIdentity, string> = { krizaka: "Krizaka", orazaka: "Orazaka", orochia: "Orochia", yomizaka: "Yomizaka" };
// @fixed: how long the kit's « Publish » shows its wait, then its success — a demo's rhythm, not a business delay.
const PUBLISH_WAIT_MS = 1100;
// @fixed: how long the success stays before the button rests again.
const PUBLISH_DONE_MS = 1800;

export interface KitWords {
  label: string;
  hint: string;
  identity: string;
  theme: string;
  themes: Record<KitTheme, string>;
  card: { title: string; status: string; upload: string; eta: string; subtitles: string; quality: string; draft: string; publish: string; published: string };
  code: string;
}

export function HeroKit({ words }: { words: KitWords }) {
  const { id, choose } = useIdentity();
  const { theme: pageTheme } = useSiteTheme();
  const [own, setOwn] = useState<KitTheme | null>(null);
  const theme = own ?? pageTheme;
  const [publish, setPublish] = useState<"idle" | "loading" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onPublish = () => {
    if (publish !== "idle") return;
    setPublish("loading");
    timers.current.push(
      setTimeout(() => setPublish("done"), PUBLISH_WAIT_MS),
      setTimeout(() => setPublish("idle"), PUBLISH_WAIT_MS + PUBLISH_DONE_MS),
    );
  };
  const scope = kitScope(id as KitIdentity, theme);
  // Until a theme is picked the kit follows the page's (no class: nothing flips at hydration on a light page).
  const worn = own ? scope : scope.replace(/\s*theme-(dark|light)$/, "");
  const c = words.card;

  return (
    <div className="kz-kit" role="group" aria-label={words.label} data-dock-yields>
      <div className="kz-kit-controls">
        <Chip.Group type="single" required size="sm" label={words.identity} value={id} onValueChange={(next) => next && choose(next as KitIdentity)}>
          {KIT_IDENTITIES.map((each) => (
            <Chip key={each} value={each} data-kit-id={each}>
              <ProductLogo id={each} size={14} animated={false} />
              {NAMES[each]}
            </Chip>
          ))}
        </Chip.Group>
        <Chip.Group type="single" required size="sm" label={words.theme} value={theme} onValueChange={(next) => next && setOwn(next as KitTheme)}>
          {KIT_THEMES.map((each) => (
            <Chip key={each} value={each} data-kit-theme={each}>
              {words.themes[each]}
            </Chip>
          ))}
        </Chip.Group>
      </div>

      <div className={`kz-kit-card ${worn}`} data-kit-scope={scope}>
        <div className="kz-kit-head">
          <strong>{c.title}</strong>
          <Badge tone="success" dot pulse>
            {c.status}
          </Badge>
        </div>
        <Progress value={72} label={c.upload} eta={c.eta} showLabel />
        <div className="kz-kit-row">
          <label htmlFor="kz-kit-subtitles">{c.subtitles}</label>
          <Switch id="kz-kit-subtitles" defaultChecked />
        </div>
        <div className="kz-kit-row">
          <span id="kz-kit-quality">{c.quality}</span>
          <Chip.Group type="single" required size="sm" label={c.quality} defaultValue="4k">
            <Chip value="1080p">1080p</Chip>
            <Chip value="4k">4K</Chip>
            <Chip value="hdr">HDR</Chip>
          </Chip.Group>
        </div>
        <div className="kz-kit-actions">
          <Button variant="secondary" size="sm">
            {c.draft}
          </Button>
          <Button variant="primary" size="sm" onClick={onPublish} loading={publish === "loading"} status={publish === "done" ? "success" : null} announce={publish === "done" ? c.published : undefined}>
            {publish === "done" ? c.published : c.publish}
          </Button>
        </div>
      </div>

      <p className="kz-kit-code">
        <span>{words.code}</span> <code>{`<div className="${scope}">`}</code>
      </p>
      <p className="kz-kit-hint">{words.hint}</p>
    </div>
  );
}
