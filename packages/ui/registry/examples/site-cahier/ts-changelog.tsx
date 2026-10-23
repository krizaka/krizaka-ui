import { ChangelogPage } from "@krizaka/ui/changelog-page";
import { SiteCahier } from "@krizaka/ui/site-cahier";

// TEMPLATE — the TypeScript site's changelog: the shared changelog template, inside the Cahier's frame and the pigeon's bar.
export default function SiteCahierTsChangelog() {
  return (
    <SiteCahier site="ts" name="Krizaka TypeScript" bird="pigeon" hue={200} nav={[{ href: "/guides", label: "Guides" }, { href: "/changelog", label: "Changelog", current: true }]} footer={{ version: "0.8.0" }}>
      <ChangelogPage
        eyebrow="Krizaka TypeScript"
        title="What changed"
        lead="Every release, newest first."
        kindLabels={{ added: "Added", changed: "Changed", fixed: "Fixed", removed: "Removed", security: "Security", breaking: "Breaking" }}
        logLabel="Releases"
        entries={[
          { id: "v0-8-0", date: "2026-10-20", dateLabel: "20 Oct 2026", version: "0.8.0", title: "Typed results", changes: [{ kind: "added", text: "ok() and fail() helpers." }, { kind: "fixed", text: "Narrowing of nested results." }] },
        ]}
      />
    </SiteCahier>
  );
}
