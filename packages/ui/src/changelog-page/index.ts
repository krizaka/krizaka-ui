/** @krizaka/ui/changelog-page — `ChangelogPage`: A changelog: a sticky date and version beside each entry, changes by kind. Server-safe; a page template. Also its data adapter: changesets, GitHub Releases and conventional PR titles in one shape, an RSS feed. */
export {
  anchorOf,
  CHANGE_TAGS,
  changeFromTitle,
  type ChangeItem,
  changelogRss,
  type ChangeTag,
  draftFromTitles,
  kindOfTag,
  newestFirst,
  parseChangesets,
  parseReleaseBody,
  plain,
  prOf,
  type Release,
  tagOf,
} from "./adapter";
export { type ChangeKind,type ChangelogEntry, ChangelogPage, type ChangelogPageProps } from "./changelog-page";
