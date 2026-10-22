import { ACCOUNT_BASELINE, AccountSection, checkAccountBaseline } from "../conformance/account-baseline.js";

const ok = { status: 200, headings: ["Profil"], radiogroups: 2, textboxes: 2 };
const routes = Object.fromEntries(Object.values(AccountSection).map((id) => [id, `/settings/${id}`]));

describe("the account baseline every app owes", () => {
  it("names the six sections, profile first", () => {
    expect(ACCOUNT_BASELINE.map((section) => section.id)).toEqual(["profile", "preferences", "security", "billing", "notifications", "data"]);
  });

  it("passes when every section exists and renders what it owes", async () => {
    expect(await checkAccountBaseline({ routes, features: { billing: true, notifications: true }, visit: async () => ok })).toEqual([]);
  });

  it("does not ask billing or notifications of a product that sells and sends nothing", async () => {
    const { billing, notifications, ...kept } = routes;
    void billing;
    void notifications;
    expect(await checkAccountBaseline({ routes: kept, visit: async () => ok })).toEqual([]);
  });

  it("fails on a missing route, a failing page, an empty page, and a profile with no avatar picker or name field", async () => {
    const { security, ...withoutSecurity } = routes;
    void security;
    const problems = await checkAccountBaseline({
      routes: withoutSecurity,
      features: { billing: true },
      visit: async (path) => (path.endsWith("billing") ? { ...ok, status: 404 } : path.endsWith("data") ? { ...ok, headings: [] } : path.endsWith("profile") ? { ...ok, radiogroups: 0, textboxes: 0 } : ok),
    });
    expect(problems).toEqual([
      expect.stringMatching(/^profile .*needs 1 radiogroup/),
      expect.stringMatching(/^profile .*needs 1 text field/),
      expect.stringMatching(/^security: no route/),
      expect.stringMatching(/^billing .*answers 404/),
      expect.stringMatching(/^data .*renders no heading/),
    ]);
  });
});
