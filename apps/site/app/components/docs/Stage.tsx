import type { Locale } from "@/lib/i18n";
import { examplePropsOf } from "@/lib/ui-example-props";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { exampleKey, type RegistryItem } from "@/lib/ui-registry";

import { playgroundPanel, StageFrame } from "./StageFrame";

/* The top of a component page: a stage. Web — the component itself with its props to play with (lib/ui-playgrounds.ts),
   or its first example, large; iOS and Android — its React Native story in a phone (StageFrame). A platform the
   component does not run on yet keeps its tab, with the honest word of the registry's parity (planned, not applicable),
   so the slot lights up when the native counterpart ships. Server Component; the playground is the client part. */
export async function Stage({ item, locale }: { item: RegistryItem; locale: Locale }) {
  const play = playgroundPanel(item, locale);
  const web = item.web?.examples[0];
  const Example = !play && web ? (await UI_EXAMPLES[exampleKey(web) as UiExampleKey]?.())?.default : undefined;
  const panel =
    play ??
    (Example && web ? (
      <div className="kz-stage-canvas">
        <Example {...examplePropsOf(exampleKey(web))} />
      </div>
    ) : null);
  return <StageFrame item={item} locale={locale} web={panel} />;
}
