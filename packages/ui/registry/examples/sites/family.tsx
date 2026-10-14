import { familyLabels, sitesByGroup } from "@krizaka/ui/sites";

// The family as data: every site of Krizaka, grouped as the bar's switcher and the footer show it. A new site is one
// release of @krizaka/ui — every bar and every footer follow.
export default function SitesFamily() {
  const t = familyLabels.en;
  return (
    <div className="grid w-full max-w-xl gap-5 sm:grid-cols-2">
      {sitesByGroup().map(({ group, sites }) => (
        <section key={group} aria-label={t.groups[group]} className="grid content-start gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-fg-secondary">{t.groups[group]}</h3>
          <ul className="grid gap-2">
            {sites.map((site) => (
              <li key={site.id} className="rounded-xl border border-border-subtle bg-surface-1 p-3">
                <a href={site.url} className="text-sm font-semibold text-fg">{site.name}</a>
                <span className="ml-2 font-mono text-xs text-fg-secondary">{site.host}</span>
                {site.status !== "released" && (
                  <span className="ml-2 rounded-full bg-surface-3 px-1.5 text-[10px] font-semibold uppercase text-fg-secondary">
                    {t.status[site.status]}
                  </span>
                )}
                <p className="mt-1 text-xs text-fg-secondary">{t.descriptions[site.id]}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
