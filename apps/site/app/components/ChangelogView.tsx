import { Button } from "@krizaka/ui/button";
import { type ChangelogEntry, ChangelogPage, kindOfTag } from "@krizaka/ui/changelog-page";
import Link from "next/link";

import { loadReleases, releaseId } from "@/lib/changelog";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/urls";

/* /changelog, in one language, on the Changelog template of @krizaka/ui: one entry per release of a package, its
   changes tagged (new · fixed · security · breaking) with the pull request behind each. */
export async function ChangelogView({ locale }: { locale: Locale }) {
  const c = getDictionary(locale).site.changelog;
  const date = new Intl.DateTimeFormat(c.langTag, { dateStyle: "long", timeZone: "UTC" });
  const entries: ChangelogEntry[] = (await loadReleases()).map((r) => ({
    id: releaseId(r),
    date: r.date,
    dateLabel: date.format(new Date(`${r.date}T12:00:00Z`)),
    version: r.url ? <a href={r.url}>{r.version}</a> : r.version,
    title: r.source,
    changes: r.changes.map((ch) => ({
      kind: kindOfTag(ch.tag),
      text: (
        <>
          {ch.text}
          {ch.pr && (
            <>
              {" "}
              <a href={ch.pr.url} aria-label={format(c.pull, { number: ch.pr.number })}>
                #{ch.pr.number}
              </a>
            </>
          )}
        </>
      ),
    })),
  }));
  return (
    <ChangelogPage
      back={{ href: localePath(locale, "/"), label: c.back }}
      linkAs={Link}
      eyebrow={c.eyebrow}
      title={c.title}
      lead={c.lead}
      actions={
        <Button asChild variant="secondary" size="md">
          <a href={`${localePath(locale, "/changelog")}/feed.xml`}>{c.feed}</a>
        </Button>
      }
      kindLabels={c.kinds}
      logLabel={c.logLabel}
      entries={entries}
    />
  );
}
