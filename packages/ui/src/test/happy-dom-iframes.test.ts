import nodeConsole from "node:console";

import { afterEach, describe, expect, it, vi } from "vitest";

import config from "../../vitest.config";
import { isIframeLoadingNotice, quietIframeLoadingNotices } from "./happy-dom-iframes";

/** The argument happy-dom really passes to console.error when an iframe is mounted (captured, not written by hand). */
function noticeOfAMountedIframe(): unknown[] {
  const spy = vi.spyOn(nodeConsole, "error").mockImplementation(() => {});
  const frame = document.createElement("iframe");
  frame.src = "https://example.com/embed";
  document.body.append(frame);
  frame.remove();
  const calls = spy.mock.calls;
  spy.mockRestore();
  expect(calls.length).toBeGreaterThan(0);
  return calls[0] as unknown[];
}

describe("happy-dom's iframe notice (krizaka-internal#3904)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("recognises the notice happy-dom emits for a mounted iframe", () => {
    expect(isIframeLoadingNotice(noticeOfAMountedIframe())).toBe(true);
  });

  it("drops that notice and keeps every other error", () => {
    const notice = noticeOfAMountedIframe();
    const error = vi.fn();
    const sink = { error };
    quietIframeLoadingNotices(sink);
    sink.error(...notice);
    sink.error(new Error("a real failure"));
    sink.error("Warning: %s", "a React warning");
    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenNthCalledWith(1, new Error("a real failure"));
  });

  it("does not take another NotSupportedError or a notice with extra arguments for it", () => {
    const other = new Error("Failed to execute 'x'.");
    other.name = "NotSupportedError";
    expect(isIframeLoadingNotice([other])).toBe(false);
    expect(isIframeLoadingNotice([...noticeOfAMountedIframe(), "more"])).toBe(false);
  });

  it("is a setup file of every web test", () => {
    expect(config.test?.setupFiles).toContain("./src/test/happy-dom-iframes.ts");
  });

  it("the console happy-dom writes to drops it", () => {
    const notice = noticeOfAMountedIframe();
    const write = vi.spyOn(process.stderr, "write");
    nodeConsole.error(...notice);
    expect(write).not.toHaveBeenCalled();
  });
});

describe("quietIframeLoadingNotices installed twice", () => {
  it("wraps the sink once", () => {
    const sink = { error: vi.fn() };
    quietIframeLoadingNotices(sink);
    const once = sink.error;
    quietIframeLoadingNotices(sink);
    expect(sink.error).toBe(once);
  });
});
