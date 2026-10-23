import { createApiClient, createSessionStore } from "@krizaka/app-client";

import { EVENTS, followLinks, keychainStorage } from "../src";
import { fakeBridge } from "./fake";

describe("keychainStorage", () => {
  it("is the KeyValueStorage of @krizaka/app-client, over the Keychain commands", async () => {
    const { bridge, calls } = fakeBridge({ "plugin:krizaka|secret_get": "yz_sess_3f9a1c0b7e2d4a5f8c6b" });
    const session = createSessionStore({ storage: keychainStorage(bridge), key: "yomizaka.session" });
    expect(await session.readToken()).toBe("yz_sess_3f9a1c0b7e2d4a5f8c6b");
    await session.clearToken();
    await session.saveToken("yz_sess_new_0123456789abcdef");
    expect(calls).toEqual([
      { command: "plugin:krizaka|secret_get", args: { key: "yomizaka.session" } },
      { command: "plugin:krizaka|secret_remove", args: { key: "yomizaka.session" } },
      { command: "plugin:krizaka|secret_set", args: { key: "yomizaka.session", value: "yz_sess_new_0123456789abcdef" } },
    ]);
    expect(typeof createApiClient).toBe("function");
  });
});

describe("followLinks", () => {
  it("listens first, then takes the links that opened the app, then follows the new ones", async () => {
    const { bridge, calls, send } = fakeBridge({ "plugin:krizaka|take_links": ["/app/rapports"] });
    const routes: string[] = [];
    const stop = await followLinks(bridge, (route) => routes.push(route));
    send(EVENTS.open, "/app/bibliotheque/bail?tags=2026");
    stop();
    send(EVENTS.open, "/app/ignored");
    expect(routes).toEqual(["/app/rapports", "/app/bibliotheque/bail?tags=2026"]);
    expect(calls).toEqual([{ command: "plugin:krizaka|take_links" }]);
  });
});
