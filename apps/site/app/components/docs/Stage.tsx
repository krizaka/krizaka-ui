// Named exports: a Server Component cannot dot into a client module (`Tabs.Root`).
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@krizaka/ui/tabs";
import { Globe, Smartphone } from "lucide-react";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { hasPlayground, playgroundControls,PLAYGROUNDS } from "@/lib/ui-playgrounds";
import { exampleKey, type RegistryItem } from "@/lib/ui-registry";

import { PhoneFrame, shotHeight } from "./PhoneFrame";
import { Playground } from "./Playground";

/* The top of a component page: a stage. Web — the component itself with its props to play with (lib/ui-playgrounds.ts),
   or its first example, large; iOS and Android — its React Native story in a phone. A platform the component does not
   run on yet keeps its tab, with the honest word of the registry's parity (planned, not applicable), so the slot lights
   up when the native counterpart ships. Server Component; the playground is the client part. */
export async function Stage({ item, locale }: { item: RegistryItem; locale: Locale }) {
  const t = getDictionary(locale).docs;
  const s = t.stage;
  const web = item.web?.examples[0];
  // The richest React Native story (the tallest screenshot) is the one the phone shows.
  const native = [...(item.native?.examples ?? [])].filter((example) => example.screenshots).sort((a, b) => shotHeight(b) - shotHeight(a))[0];
  const spec = hasPlayground(item.name) ? PLAYGROUNDS[item.name] : null;
  const controls = spec ? playgroundControls(spec, item.web?.props.find((group) => group.component === spec.component)?.props ?? []) : [];
  const Example = !spec && web ? (await UI_EXAMPLES[exampleKey(web) as UiExampleKey]?.())?.default : undefined;
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
  const defaultTab = web || spec ? "web" : "ios";

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
          {spec ? (
            <Playground name={item.name as keyof typeof PLAYGROUNDS} controls={controls} words={s.playground} />
          ) : Example && web ? (
            <div className="kz-stage-canvas">
              <Example {...examplePropsOf(exampleKey(web))} />
            </div>
          ) : (
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
