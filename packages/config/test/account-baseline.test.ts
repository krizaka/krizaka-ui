import { ACCOUNT_BASELINE, AccountSection, checkAccountBaseline, playwrightVisit } from "../conformance/account-baseline.js";

const full = { radiogroup: 2, textbox: 2, password: 1, file: 0, switch: 3, checkbox: 0, button: 4, link: 2 };
const ok = { status: 200, headings: ["Profil"], controls: full };
const routes = Object.fromEntries(Object.values(AccountSection).map((id) => [id, `/settings/${id}`]));
const only = (controls: Record<string, number>) => ({ status: 200, headings: ["A section"], controls });

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

  it("fails on a missing route, a failing page, an empty page, and a profile with no avatar or name field", async () => {
    const { security, ...withoutSecurity } = routes;
    void security;
    const problems = await checkAccountBaseline({
      routes: withoutSecurity,
      features: { billing: true },
      visit: async (path) =>
        path.endsWith("billing") ? { ...ok, status: 404 } : path.endsWith("data") ? { ...ok, headings: [] } : path.endsWith("profile") ? only({ button: 1 }) : ok,
    });
    expect(problems).toEqual([
      expect.stringMatching(/^profile .*needs an avatar/),
      expect.stringMatching(/^profile .*needs a display name field/),
      expect.stringMatching(/^security: no route/),
      expect.stringMatching(/^billing .*answers 404/),
      expect.stringMatching(/^data .*renders no heading/),
    ]);
  });

  it("accepts an avatar upload instead of a picker, and a password-only security section (review #514)", async () => {
    const visit = async (path: string) =>
      path.endsWith("profile") ? only({ file: 1, textbox: 1 }) : path.endsWith("security") ? only({ password: 2 }) : ok;
    expect(await checkAccountBaseline({ routes, visit })).toEqual([]);
  });

  it("refuses a heading-only placeholder in every section (review #514)", async () => {
    const problems = await checkAccountBaseline({ routes, features: { billing: true, notifications: true }, visit: async () => only({}) });
    expect(problems.map((p) => p.split(" ")[0])).toEqual(["profile", "profile", "preferences", "security", "billing", "notifications", "data"]);
    expect(await checkAccountBaseline({ routes: { data: "/d" }, visit: async () => only({ button: 1 }) })).toContainEqual(expect.stringMatching(/^data .*an export and an account deletion/));
  });
});

describe("the Playwright visit", () => {
  it("counts password and file inputs apart from the roles (review #514)", async () => {
    const counts: Record<string, number> = { radiogroup: 0, textbox: 1, switch: 0, checkbox: 0, button: 2, link: 0, heading: 1 };
    const page = {
      goto: async () => ({ status: () => 200 }),
      getByRole: (role: string) => ({ count: async () => counts[role] ?? 0, allInnerTexts: async () => ["Security"] }),
      locator: (selector: string) => ({ count: async () => (selector.includes("password") ? 2 : selector.includes("file") ? 1 : 0) }),
    };
    expect(await playwrightVisit(page, "http://localhost/")("/settings/security")).toEqual({
      status: 200,
      headings: ["Security"],
      controls: { radiogroup: 0, textbox: 1, switch: 0, checkbox: 0, button: 2, link: 0, password: 2, file: 1 },
    });
  });
});
