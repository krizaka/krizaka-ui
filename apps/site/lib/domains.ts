/* The twelve functional domains (ADR-008 §3) as a bare list: no data, so a client component (the catalogue's filter) can
   import it without the inventory. lib/ui-domains.ts adds the entries' facts. */

import type { Domain, RegistryItem } from "./ui-registry";

/** The twelve domains, in the order of ADR-008 §3. */
export const DOMAINS = ["foundations", "forms", "data-display", "navigation-shell", "feedback", "maps", "media", "commerce", "identity", "conversation", "page-blocks", "cahier"] as const satisfies readonly Domain[];

/** The domain of an entry: its meta's; @krizaka/charts has none yet and is data display (ADR-008 §3). */
export const domainOf = (item: Pick<RegistryItem, "domain">): Domain => item.domain ?? "data-display";
