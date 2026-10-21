/** Where the footer's version link lands: the release's entry when the changelog has it, else the changelog's top. A
 *  release is on the page only once npm knows its date (lib/changelog.ts), and a deploy can be live a moment before. */
export function changelogHref(changelogPath: string, version: string, ids: Iterable<string>): string {
  return new Set(ids).has(version) ? `${changelogPath}#${version}` : changelogPath;
}
