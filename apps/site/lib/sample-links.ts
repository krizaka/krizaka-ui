/* The links and forms inside a documentation example (and the catalogue's thumbnails) are samples: a pagination's
   « page 6 », a nav bar's « #docs », a search field's Enter. Followed, they led to a 404 of this site or jumped to the
   top of the page. They stay in place; a link to another site (a mailto, the npm page) keeps working. */

/** True when following `href` from a sample would leave nothing useful behind: a path, an anchor or an address of this site. */
export function staysInPlace(href: string | null, siteOrigin: string): boolean {
  if (href === null || href === "") return true;
  if (/^(mailto|tel|sms):/i.test(href)) return false;
  try {
    return new URL(href, siteOrigin).origin === new URL(siteOrigin).origin;
  } catch {
    return true;
  }
}
