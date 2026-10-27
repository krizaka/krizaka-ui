import { afterEach, describe, expect, it, vi } from "vitest";

import { connectShopPreview, postToPreview, readPreviewMessage } from "./preview";

const ORIGIN = "https://studio.example.com";
const msg = (data: unknown, origin = ORIGIN) => ({ origin, data }) as MessageEvent;

describe("the preview bridge", () => {
  it("accepts the three messages from the composer's origin, and nothing else", () => {
    expect(readPreviewMessage(msg({ source: "krizaka-shop-composer", type: "select", key: "s_8f2c" }), ORIGIN)).toEqual({ source: "krizaka-shop-composer", type: "select", key: "s_8f2c" });
    expect(readPreviewMessage(msg({ source: "krizaka-shop-composer", type: "refresh" }), ORIGIN)?.type).toBe("refresh");
    expect(readPreviewMessage(msg({ source: "krizaka-shop-composer", type: "select", key: "s_8f2c" }, "https://evil.example"), ORIGIN)).toBeNull();
    expect(readPreviewMessage(msg({ source: "other", type: "select", key: "s_8f2c" }), ORIGIN)).toBeNull();
    expect(readPreviewMessage(msg({ source: "krizaka-shop-composer", type: "eval", key: "x" }), ORIGIN)).toBeNull();
    expect(readPreviewMessage(msg({ source: "krizaka-shop-composer", type: "select", key: '"]; alert(1);//' }), ORIGIN)).toBeNull();
    expect(readPreviewMessage(msg("select"), ORIGIN)).toBeNull();
    expect(readPreviewMessage(msg(null), ORIGIN)).toBeNull();
  });

  it("posts to the preview addressed to its origin only", () => {
    const target = { postMessage: vi.fn() };
    postToPreview(target, ORIGIN, { source: "krizaka-shop-composer", type: "scroll", key: "s_1" });
    expect(target.postMessage).toHaveBeenCalledWith({ source: "krizaka-shop-composer", type: "scroll", key: "s_1" }, ORIGIN);
    expect(() => postToPreview(null, ORIGIN, { source: "krizaka-shop-composer", type: "refresh" })).not.toThrow();
  });
});

describe("the page's side", () => {
  afterEach(() => (document.body.innerHTML = ""));

  it("outlines the selected section, scrolls to it, and ignores a message from another origin", () => {
    document.body.innerHTML = `<div data-shop-key="s_1"></div><div data-shop-key="s_2"></div>`;
    const [a, b] = [...document.querySelectorAll<HTMLElement>("[data-shop-key]")];
    b!.scrollIntoView = vi.fn();
    const onRefresh = vi.fn();
    const off = connectShopPreview({ composerOrigin: ORIGIN, onRefresh });
    window.dispatchEvent(Object.assign(new Event("message"), { origin: "https://evil.example", data: { source: "krizaka-shop-composer", type: "select", key: "s_1" } }));
    expect(a!.hasAttribute("data-shop-selected")).toBe(false);
    window.dispatchEvent(Object.assign(new Event("message"), { origin: ORIGIN, data: { source: "krizaka-shop-composer", type: "select", key: "s_1" } }));
    expect(a!.hasAttribute("data-shop-selected")).toBe(true);
    window.dispatchEvent(Object.assign(new Event("message"), { origin: ORIGIN, data: { source: "krizaka-shop-composer", type: "scroll", key: "s_2" } }));
    expect(a!.hasAttribute("data-shop-selected")).toBe(false);
    expect(b!.hasAttribute("data-shop-selected")).toBe(true);
    expect(b!.scrollIntoView).toHaveBeenCalled();
    window.dispatchEvent(Object.assign(new Event("message"), { origin: ORIGIN, data: { source: "krizaka-shop-composer", type: "refresh" } }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
    off();
    window.dispatchEvent(Object.assign(new Event("message"), { origin: ORIGIN, data: { source: "krizaka-shop-composer", type: "refresh" } }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
