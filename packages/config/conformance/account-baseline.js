// The account baseline every Krizaka app owes (Oussama, 2026-10-22: « Avatar, etc. Ça doit être systématique »): the same
// sections, from the `app-settings` template and the account-settings blocks of @krizaka/ui, on web and native. An app runs
// `checkAccountBaseline` in its CI, signed in as a persona; it fails when a section is missing or renders empty.

/** The sections of the account area. */
export const AccountSection = Object.freeze({
  Profile: "profile",
  Preferences: "preferences",
  Security: "security",
  Billing: "billing",
  Notifications: "notifications",
  Data: "data",
});

/**
 * What each section owes, and when. `needs` is the product feature that makes it required (a product that does not sell has
 * no billing section; one that sends nothing has no notifications).
 * @type {readonly { id: string, needs: "billing" | "notifications" | null, radiogroups: number, textboxes: number, why: string }[]}
 */
export const ACCOUNT_BASELINE = Object.freeze([
  { id: AccountSection.Profile, needs: null, radiogroups: 1, textboxes: 1, why: "avatar (a picker, or an upload), display name, e-mail with its verified status" },
  { id: AccountSection.Preferences, needs: null, radiogroups: 1, textboxes: 0, why: "language and theme" },
  { id: AccountSection.Security, needs: null, radiogroups: 0, textboxes: 1, why: "password change, active sessions" },
  { id: AccountSection.Billing, needs: "billing", radiogroups: 0, textboxes: 0, why: "the subscription and the billing portal, where the product sells" },
  { id: AccountSection.Notifications, needs: "notifications", radiogroups: 0, textboxes: 0, why: "what the product sends, where it sends anything" },
  { id: AccountSection.Data, needs: null, radiogroups: 0, textboxes: 0, why: "my data: export, and account deletion with confirmation (Loi 25)" },
]);

/**
 * @typedef {object} Visited what a visit of one section found
 * @property {number} status the HTTP status after redirects
 * @property {readonly string[]} headings the text of the page's headings
 * @property {number} radiogroups the `radiogroup`s on the page
 * @property {number} textboxes the `textbox`es on the page
 */

/**
 * Checks the account baseline of an app.
 * @param {{ routes: Partial<Record<string, string>>, features?: { billing?: boolean, notifications?: boolean }, visit: (path: string) => Promise<Visited> }} options
 *   `routes`: the route of each section; `visit`: signs in as a persona and opens a route (a Playwright page, or a fetch of the rendered HTML).
 * @returns {Promise<string[]>} one line per problem; empty when the app conforms
 */
export async function checkAccountBaseline({ routes, features = {}, visit }) {
  /** @type {string[]} */
  const problems = [];
  for (const section of ACCOUNT_BASELINE) {
    if (section.needs && !features[section.needs]) continue;
    const path = routes[section.id];
    if (!path) {
      problems.push(`${section.id}: no route (${section.why})`);
      continue;
    }
    const page = await visit(path);
    if (page.status !== 200) problems.push(`${section.id} ${path}: answers ${page.status}`);
    else if (page.headings.length === 0) problems.push(`${section.id} ${path}: renders no heading`);
    else {
      if (page.radiogroups < section.radiogroups) problems.push(`${section.id} ${path}: needs ${section.radiogroups} radiogroup(s) (${section.why}), found ${page.radiogroups}`);
      if (page.textboxes < section.textboxes) problems.push(`${section.id} ${path}: needs ${section.textboxes} text field(s) (${section.why}), found ${page.textboxes}`);
    }
  }
  return problems;
}

/**
 * The `visit` of a Playwright page: opens `base + path` and reads the headings, the radiogroups and the text fields.
 * @param {any} page a Playwright page, already signed in as the persona
 * @param {string} base
 * @returns {(path: string) => Promise<Visited>}
 */
export function playwrightVisit(page, base) {
  return async (path) => {
    const response = await page.goto(`${base.replace(/\/$/, "")}${path}`, { waitUntil: "networkidle" });
    return {
      status: response?.status() ?? 0,
      headings: await page.getByRole("heading").allInnerTexts(),
      radiogroups: await page.getByRole("radiogroup").count(),
      textboxes: await page.getByRole("textbox").count(),
    };
  };
}
