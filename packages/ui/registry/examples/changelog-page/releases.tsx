import { ChangelogPage } from "@krizaka/ui/changelog-page";

// TEMPLATE — what changed (Krizaka UI's releases): the date and version stick beside each entry, the changes by kind in
// words and colour. On a phone the date sits above its entry.
export default function ChangelogPageReleases() {
  return (
    <ChangelogPage
      eyebrow="Krizaka UI"
      title="What changed"
      lead="Every release, newest first — and why, when it was a decision."
      kindLabels={{ added: "Added", changed: "Changed", fixed: "Fixed", removed: "Removed" }}
      logLabel="Releases"
      entries={[
        {
          id: "v2-6-0",
          date: "2026-10-11",
          dateLabel: "11 Oct 2026",
          version: "2.6.0",
          title: "Page blocks",
          changes: [
            { kind: "added", text: "Page, PageHero, CardGrid, LinkCard, ArgumentCard and seven more blocks." },
            { kind: "changed", text: "The blocks' stylesheet is imported once by the app." },
          ],
        },
        {
          id: "v2-4-0",
          date: "2026-10-09",
          dateLabel: "9 Oct 2026",
          version: "2.4.0",
          title: "Data and media",
          changes: [
            { kind: "added", text: "DataTable, Combobox, DatePicker, VideoPlayer." },
            { kind: "fixed", text: "A live line chart no longer hides its line." },
          ],
        },
      ]}
    />
  );
}
