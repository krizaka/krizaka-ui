import type { Locale } from "@/lib/i18n";
import { UI_EXAMPLE_KEYS } from "@/lib/ui-example-keys";
import { exampleKey, type RegistryItem } from "@/lib/ui-registry";

import { LiveExample } from "./LiveExample";
import { playgroundPanel, StageFrame } from "./StageFrame";

/* The top of a component page: a stage. Web — the component itself with its props to play with (lib/ui-playgrounds.ts),
   or its first example, large (LiveExample: in the static HTML, its code a lazy chunk); iOS and Android — its React
   Native story in a phone (StageFrame). A platform the component does not run on yet keeps its tab, with the honest word
   of the registry's parity (planned, not applicable), so the slot lights up when the native counterpart ships. Server
   Component; the playground and the example are the client parts. */
export function Stage({ item, locale }: { item: RegistryItem; locale: Locale }) {
  const play = playgroundPanel(item, locale);
  const web = item.web?.examples[0];
  const key = web ? exampleKey(web) : null;
  const panel =
    play ??
    (key && UI_EXAMPLE_KEYS.has(key) ? (
      <div className="kz-stage-canvas">
        <LiveExample exampleKey={key} />
      </div>
    ) : null);
  return <StageFrame item={item} locale={locale} web={panel} />;
}
