/**
 * The allow-list of an app: which addresses a manifest may send it to. `https` only, no credentials, no port but 443,
 * no query or fragment (it is a base), a name (never an IP) equal to or under one of the baked domain suffixes. A
 * suffix is a registrable domain we own (`krizaka.com`): never a shared one (`b-cdn.net`, `ondigitalocean.app`).
 */
export function isAllowedUrl(value: string, suffixes: readonly string[]): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) return false;
  if (url.search || url.hash) return false;
  const host = url.hostname.toLowerCase();
  if (host.endsWith(".") || /^[\d.]+$/.test(host) || host.includes(":")) return false;
  return suffixes.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

/** `https://host/edge/` → `https://host/edge` (a base is joined with a path that starts with a slash). */
export function normalizeBase(value: string): string {
  return value.replace(/\/+$/, "");
}
