import { COMMANDS, createFolders, EVENTS, PLUGIN } from "../src";
import { fakeBridge } from "./fake";

describe("createFolders", () => {
  it("calls the plugin's folder commands with the path", async () => {
    const { bridge, calls } = fakeBridge({
      "plugin:krizaka|folders": ["/Users/eric/Baux"],
      "plugin:krizaka|grant_folder": "/Users/eric/Baux",
      "plugin:krizaka|revoke_folder": [],
      "plugin:krizaka|list_folder": { entries: [], truncated: false },
      "plugin:krizaka|watch_folder": "/Users/eric/Baux",
    });
    const folders = createFolders(bridge);
    expect(await folders.list()).toEqual(["/Users/eric/Baux"]);
    expect(await folders.grant()).toBe("/Users/eric/Baux");
    expect(await folders.read("/Users/eric/Baux")).toEqual({ entries: [], truncated: false });
    expect(await folders.watch("/Users/eric/Baux")).toBe("/Users/eric/Baux");
    await folders.unwatch("/Users/eric/Baux");
    expect(await folders.revoke("/Users/eric/Baux")).toEqual([]);
    expect(calls).toEqual([
      { command: "plugin:krizaka|folders" },
      { command: "plugin:krizaka|grant_folder" },
      { command: "plugin:krizaka|list_folder", args: { path: "/Users/eric/Baux" } },
      { command: "plugin:krizaka|watch_folder", args: { path: "/Users/eric/Baux" } },
      { command: "plugin:krizaka|unwatch_folder", args: { path: "/Users/eric/Baux" } },
      { command: "plugin:krizaka|revoke_folder", args: { path: "/Users/eric/Baux" } },
    ]);
  });

  it("hands the dropped files and the changed folders to their handlers, until stopped", async () => {
    const { bridge, send, listening } = fakeBridge();
    const folders = createFolders(bridge);
    const dropped: string[][] = [];
    const changed: string[] = [];
    const dragging: boolean[] = [];
    const stopDragging = await folders.onDragging((value) => dragging.push(value));
    const stopDropped = await folders.onDropped((paths) => dropped.push(paths));
    const stopChanged = await folders.onChanged((folder) => changed.push(folder));
    send(EVENTS.dragging, true);
    send(EVENTS.dragging, false);
    stopDragging();
    send(EVENTS.dragging, true);
    send(EVENTS.dropped, ["/Users/eric/bail.pdf"]);
    send(EVENTS.folderChanged, "/Users/eric/Baux");
    stopDropped();
    stopChanged();
    send(EVENTS.dropped, ["/Users/eric/autre.pdf"]);
    expect(dropped).toEqual([["/Users/eric/bail.pdf"]]);
    expect(changed).toEqual(["/Users/eric/Baux"]);
    expect(dragging).toEqual([true, false]);
    expect(listening(EVENTS.dropped)).toBe(0);
  });

  it("names the plugin's commands exactly (the contract with tauri-plugin-krizaka's build.rs)", () => {
    expect(PLUGIN).toBe("krizaka");
    expect([...COMMANDS].sort()).toEqual(
      [
        "folders",
        "grant_folder",
        "list_folder",
        "revoke_folder",
        "secret_get",
        "secret_remove",
        "secret_set",
        "set_menu",
        "set_update_channel",
        "take_links",
        "unwatch_folder",
        "update_channel",
        "watch_folder",
      ].sort(),
    );
    expect(Object.values(EVENTS).every((event) => event.startsWith("krizaka://"))).toBe(true);
  });
});
