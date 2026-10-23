import { createUpdates, EVENTS, type MenuSpec, setNativeMenu } from "../src";
import { fakeBridge } from "./fake";

const labels = {
  about: "À propos de Yomizaka",
  hide: "Masquer Yomizaka",
  hideOthers: "Masquer les autres",
  showAll: "Tout afficher",
  quit: "Quitter Yomizaka",
  edit: "Édition",
  undo: "Annuler",
  redo: "Rétablir",
  cut: "Couper",
  copy: "Copier",
  paste: "Coller",
  selectAll: "Tout sélectionner",
  window: "Fenêtre",
  minimize: "Réduire",
  zoom: "Zoom",
  close: "Fermer",
};

describe("setNativeMenu", () => {
  it("sends the menu, then runs the handler of the chosen item (and ignores ids it does not know)", async () => {
    const { bridge, calls, send } = fakeBridge();
    const spec: MenuSpec = { labels, menus: [{ title: "Fichier", items: [{ id: "check.new", label: "Nouvelle vérification", accelerator: "CmdOrCtrl+N" }] }] };
    const chosen: string[] = [];
    const stop = await setNativeMenu(bridge, spec, { "check.new": () => chosen.push("check.new") });
    send(EVENTS.menu, "check.new");
    send(EVENTS.menu, "unknown");
    stop();
    send(EVENTS.menu, "check.new");
    expect(chosen).toEqual(["check.new"]);
    expect(calls).toEqual([{ command: "plugin:krizaka|set_menu", args: { spec } }]);
  });
});

describe("createUpdates", () => {
  it("reads and sets the channel", async () => {
    const { bridge, calls } = fakeBridge({
      "plugin:krizaka|update_channel": { channel: "stable", feed: null },
      "plugin:krizaka|set_update_channel": { channel: "beta", feed: "https://example.com/beta/latest.json" },
    });
    const updates = createUpdates(bridge);
    expect(await updates.get()).toEqual({ channel: "stable", feed: null });
    expect((await updates.set("beta")).channel).toBe("beta");
    expect(calls.at(-1)).toEqual({ command: "plugin:krizaka|set_update_channel", args: { channel: "beta" } });
  });
});
