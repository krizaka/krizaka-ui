/* The stars of a repository, read from api.github.com when the site is built (output: "export"). Fail soft: a rate limit,
   an error or a malformed answer gives nothing, and the page shows no figure rather than a wrong one. Anonymous: 60
   requests an hour is plenty for one call per build. */

/** `GET /repos/{owner}/{repo}` → its star count; null when the payload does not hold a sound one. */
export function parseStars(payload: unknown): number | null {
  const n = (payload as { stargazers_count?: unknown } | null)?.stargazers_count;
  return typeof n === "number" && Number.isInteger(n) && n >= 0 ? n : null;
}

/** Below this the figure does not inform a visitor: the page shows no stars rather than a discouraging count. */
// @fixed: a presentation threshold, not a business rule.
export const STARS_SHOWN_FROM = 10;

/** Whether a star count is worth a figure on the page. */
export const showStars = (n: number | null): n is number => n !== null && n >= STARS_SHOWN_FROM;

const cache = new Map<string, Promise<number | null>>();

/** The stars of `owner/repo`, once per build; null when GitHub could not answer. */
export function githubStars(repo: string): Promise<number | null> {
  let hit = cache.get(repo);
  if (!hit) {
    hit = (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { accept: "application/vnd.github+json", "user-agent": "krizaka-ui-site-build" },
          signal: AbortSignal.timeout(8000),
        });
        return res.ok ? parseStars(await res.json()) : null;
      } catch {
        return null;
      }
    })();
    cache.set(repo, hit);
  }
  return hit;
}
