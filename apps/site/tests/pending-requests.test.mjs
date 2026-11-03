// krizaka-ui#952: /components never reached networkidle (a catalogue preview loaded Cloudflare Turnstile) and the crawl said only
// « Timeout 30000ms exceeded »; the cause was found by listing the pending requests by hand. The crawl now names them.
import assert from "node:assert/strict";
import { test } from "node:test";

import { isNetworkIdleTimeout, pendingReport,pendingRequests } from "../scripts/pending-requests.mjs";

const page = () => {
  const handlers = {};
  return { on: (event, fn) => (handlers[event] = fn), emit: (event, arg) => handlers[event](arg) };
};
const request = (url, type = "script") => ({ url: () => url, resourceType: () => type });

test("the pending requests are the ones started and neither finished nor failed", () => {
  const p = page();
  let clock = 1000;
  const pending = pendingRequests(p, () => clock);
  const turnstile = request("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
  const css = request("http://localhost:4600/_next/static/app.css", "stylesheet");
  const gone = request("http://localhost:4600/missing.png", "image");
  p.emit("request", turnstile);
  p.emit("request", css);
  p.emit("request", gone);
  p.emit("requestfinished", css);
  p.emit("requestfailed", gone);
  clock = 31_000;
  assert.deepEqual(pending.list(), [{ url: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", type: "script", ageSeconds: 30 }]);
  pending.reset();
  assert.deepEqual(pending.list(), []);
});

test("a networkidle timeout is reported with what is still pending, oldest first, at most five", () => {
  const list = Array.from({ length: 7 }, (_, i) => ({ url: `https://x.example/${i}`, type: "fetch", ageSeconds: 30 - i }));
  const report = pendingReport(list);
  assert.match(report, /^never reached networkidle; 7 requests still pending: https:\/\/x\.example\/0 \(fetch, 30 s\)/);
  assert.match(report, /and 2 more$/);
  assert.equal(pendingReport([]), "never reached networkidle; no request pending (a long task or a timer keeps it busy)");
});

test("only a timeout of the navigation is read as networkidle never reached", () => {
  assert.equal(isNetworkIdleTimeout(Object.assign(new Error("page.goto: Timeout 30000ms exceeded."), { name: "TimeoutError" })), true);
  assert.equal(isNetworkIdleTimeout(new Error("net::ERR_CONNECTION_REFUSED")), false);
});
