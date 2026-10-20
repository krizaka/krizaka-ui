// Named exports: a Server Component cannot dot into a client module (`Tabs.Root`).
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import { Globe, Smartphone } from "lucide-react";
import type { ReactNode } from "react";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { hasPlayground, playgroundControls, PLAYGROUNDS } from "@/lib/ui-playgrounds";
import type { RegistryItem } from "@/lib/ui-registry";

import { PhoneFrame, shotHeight } from "./PhoneFrame";
import { Playground } from "./Playground";

/* The frame of a stage (Stage.tsx): web · iOS · Android, the web panel given by the caller. Apart from Stage so that a
   page showing only playgrounds (the home) does not import the registry's examples map (lib/ui-examples.ts): a route
   ships the client code of every module its server components may import. Server Component. */
export function StageFrame({ item, locale, web }: { item: RegistryItem; locale: Locale; web: ReactNode | null }) {
  const t = getDictionary(locale).docs;
  const s = t.stage;
  // The richest React Native story (the tallest screenshot) is the one the phone shows.
  const native = [...(item.native?.examples ?? [])].filter((example) => example.screenshots).sort((a, b) => shotHeight(b) - shotHeight(a))[0];
  const spec = hasPlayground(item.name) ? PLAYGROUNDS[item.name] : null;
  const nativeWord = item.parity?.native.state === "gap" ? s.planned : s.webOnly;
  const phone = (os: "ios" | "android") =>
    native ? (
      <div className="kz-stage-phone">
        <PhoneFrame example={native} os={os} alt={format(t.component.nativeShot, { name: `${item.title} — ${native.title}` })} />
        <p className="kz-docs-note">{format(s.nativeCaption, { example: native.title })}</p>
      </div>
    ) : (
      <div className="kz-stage-slot">
        <Smartphone aria-hidden />
        <p>{nativeWord}</p>
      </div>
    );
  const defaultTab = web ? "web" : "ios";

  return (
    <section className="kz-stage not-prose" aria-label={format(s.label, { name: item.title })}>
      <TabsRoot defaultValue={defaultTab} variant="segmented">
        <div className="kz-stage-bar">
          <TabsList aria-label={s.platforms}>
            <TabsTrigger value="web">
              <Globe aria-hidden size={14} /> {s.web}
            </TabsTrigger>
            <TabsTrigger value="ios">{s.ios}</TabsTrigger>
            <TabsTrigger value="android">{s.android}</TabsTrigger>
          </TabsList>
          {spec && <span className="kz-stage-hint">{s.play}</span>}
        </div>
        <TabsContent value="web" className="kz-stage-panel">
          {web ?? (
            <div className="kz-stage-slot">
              <Globe aria-hidden />
              <p>{s.nativeOnly}</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="ios" className="kz-stage-panel">
          {phone("ios")}
        </TabsContent>
        <TabsContent value="android" className="kz-stage-panel">
          {phone("android")}
        </TabsContent>
      </TabsRoot>
    </section>
  );
}

/** The web panel of a component with a playground (lib/ui-playgrounds.ts): its props to play with; null without one. */
export function playgroundPanel(item: RegistryItem, locale: Locale): ReactNode | null {
  if (!hasPlayground(item.name)) return null;
  const spec = PLAYGROUNDS[item.name];
  const controls = playgroundControls(spec, item.web?.props.find((group) => group.component === spec.component)?.props ?? []);
  return <Playground name={item.name} controls={controls} words={getDictionary(locale).docs.stage.playground} />;
}

/** A stage for a component that has a playground — what the home shows. */
export function PlayStage({ item, locale }: { item: RegistryItem; locale: Locale }) {
  return <StageFrame item={item} locale={locale} web={playgroundPanel(item, locale)} />;
}
