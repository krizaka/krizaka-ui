import { familyLabels, siteById, type SiteId } from "@krizaka/ui/sites";

const ids: SiteId[] = ["orazaka", "orochia", "yasakia", "yororis"];

// The family's words in French: pass `familyLabels.fr` (or your own translation of the same shape) to the bar and the
// footer; a site's name, address and status never change with the language.
export default function SitesFrench() {
  const t = familyLabels.fr;
  return (
    <dl className="grid w-full max-w-md gap-3">
      {ids.map((id) => {
        const site = siteById(id);
        return (
          <div key={id} className="grid gap-0.5">
            <dt className="text-sm font-semibold text-fg">
              {site.name}
              {site.status !== "released" && <span className="ml-2 text-xs font-normal text-fg-secondary">· {t.status[site.status]}</span>}
            </dt>
            <dd className="text-xs text-fg-secondary">{t.descriptions[id]}</dd>
          </div>
        );
      })}
    </dl>
  );
}
