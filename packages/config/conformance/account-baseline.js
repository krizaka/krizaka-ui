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
 * The controls a visit observes on a page, by what they let a person do. `password` and `file` are counted apart: a
 * password field has no `textbox` role, and an upload is a file input, not a radiogroup.
 * @typedef {"radiogroup" | "textbox" | "password" | "file" | "switch" | "checkbox" | "button" | "link"} Control
 */

/**
 * What each section owes, and when. `needs` is the product feature that makes it required (a product that does not sell has
 * no billing section; one that sends nothing has no notifications). `owes` lists what must be there, each item a set of
 * alternatives (`[{ radiogroup: 1 }, { file: 1 }]`: an avatar picker or an upload): a heading alone never passes.
 * @type {readonly { id: string, needs: "billing" | "notifications" | null, owes: readonly { what: string, anyOf: readonly Partial<Record<Control, number>>[] }[], why: string }[]}
 */
export const ACCOUNT_BASELINE = Object.freeze([
  {
    id: AccountSection.Profile,
    needs: null,
    owes: [
      { what: "an avatar (a picker or an upload)", anyOf: [{ radiogroup: 1 }, { file: 1 }] },
      { what: "a display name field", anyOf: [{ textbox: 1 }] },
    ],
    why: "avatar (a picker, or an upload), display name, e-mail with its verified status",
  },
  { id: AccountSection.Preferences, needs: null, owes: [{ what: "a language or theme choice", anyOf: [{ radiogroup: 1 }] }], why: "language and theme" },
  {
    id: AccountSection.Security,
    needs: null,
    owes: [{ what: "a password change or the active sessions", anyOf: [{ password: 1 }, { button: 1 }] }],
    why: "password change, active sessions",
  },
  { id: AccountSection.Billing, needs: "billing", owes: [{ what: "the way to the billing portal", anyOf: [{ link: 1 }, { button: 1 }] }], why: "the subscription and the billing portal, where the product sells" },
  {
    id: AccountSection.Notifications,
    needs: "notifications",
    owes: [{ what: "a setting per kind of message", anyOf: [{ switch: 1 }, { checkbox: 1 }] }],
    why: "what the product sends, where it sends anything",
  },
  {
    id: AccountSection.Data,
    needs: null,
    owes: [{ what: "an export and an account deletion", anyOf: [{ button: 2 }, { button: 1, link: 1 }, { link: 2 }] }],
    why: "my data: export, and account deletion with confirmation (Loi 25)",
  },
]);

/**
 * @typedef {object} Visited what a visit of one section found
 * @property {number} status the HTTP status after redirects
 * @property {readonly string[]} headings the text of the page's headings
 * @property {Partial<Record<Control, number>>} controls how many of each control the page shows (a missing one is 0)
 */

/** @param {Partial<Record<string, number>>} controls @param {Partial<Record<string, number>>} wanted */
const meets = (controls, wanted) => Object.entries(wanted).every(([control, count]) => (controls[control] ?? 0) >= (count ?? 0));

/** @param {Partial<Record<string, number>>} wanted */
const spell = (wanted) => Object.entries(wanted).map(([control, count]) => `${count} ${control}`).join(" + ");

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
    else
      for (const item of section.owes)
        if (!item.anyOf.some((wanted) => meets(page.controls, wanted)))
          problems.push(`${section.id} ${path}: needs ${item.what} (${item.anyOf.map(spell).join(" or ")})`);
  }
  return problems;
}

/**
 * The `visit` of a Playwright page: opens `base + path` and reads the headings and the controls.
 * @param {any} page a Playwright page, already signed in as the persona
 * @param {string} base
 * @returns {(path: string) => Promise<Visited>}
 */
export function playwrightVisit(page, base) {
  return async (path) => {
    const response = await page.goto(`${base.replace(/\/$/, "")}${path}`, { waitUntil: "networkidle" });
    /** @type {Partial<Record<Control, number>>} */
    const controls = {};
    for (const role of /** @type {const} */ (["radiogroup", "textbox", "switch", "checkbox", "button", "link"])) controls[role] = await page.getByRole(role).count();
    // No implicit role: a password field is not a textbox, a file input is a (hidden) input behind its button.
    controls.password = await page.locator('input[type="password"]').count();
    controls.file = await page.locator('input[type="file"]').count();
    return { status: response?.status() ?? 0, headings: await page.getByRole("heading").allInnerTexts(), controls };
  };
}
