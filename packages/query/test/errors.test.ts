import { codeForStatus, isKrizakaApiError, KrizakaApiError, problemFromResponse, readRetryAt } from "../src/errors";

const headers = (values: Record<string, string> = {}) => new Headers(values);
const NOW = Date.parse("2026-10-12T10:00:00Z");

describe("KrizakaApiError", () => {
  it("defaults its code, type and title from the status", () => {
    const error = new KrizakaApiError({ status: 404 });
    expect(error).toMatchObject({ name: "KrizakaApiError", status: 404, code: "not-found", type: "about:blank", title: "not-found", message: "not-found" });
    expect(error.messageKey()).toBe("apiErrors.not-found");
    expect(error.messageKey("errors")).toBe("errors.not-found");
    expect(error.retryInMs()).toBeUndefined();
    expect(error.cause).toBeUndefined();
  });

  it("keeps a cause and says how long to wait", () => {
    const cause = new Error("boom");
    const error = new KrizakaApiError({ status: 429, retryAt: NOW + 5000, cause, title: "Slow down" });
    expect(error.cause).toBe(cause);
    expect(error.message).toBe("Slow down");
    expect(error.retryInMs(NOW)).toBe(5000);
    expect(error.retryInMs(NOW + 9000)).toBe(0);
  });

  it("is recognised across copies of the package", () => {
    const copy = Object.assign(new Error("x"), { name: "KrizakaApiError", code: "conflict", status: 409 });
    expect(isKrizakaApiError(copy)).toBe(true);
    expect(isKrizakaApiError(new KrizakaApiError({ status: 500 }))).toBe(true);
    expect(isKrizakaApiError(new Error("x"))).toBe(false);
    expect(isKrizakaApiError("x")).toBe(false);
  });

  it.each([
    [0, "network"],
    [400, "bad-request"],
    [401, "unauthorized"],
    [403, "forbidden"],
    [409, "conflict"],
    [418, "bad-request"],
    [422, "validation-failed"],
    [429, "rate-limited"],
    [500, "server"],
    [503, "unavailable"],
  ])("names status %i %s", (status, code) => expect(codeForStatus(status)).toBe(code));
});

describe("readRetryAt", () => {
  it("reads the body first, then Retry-After", () => {
    expect(readRetryAt(null, { retryAt: NOW + 1 }, NOW)).toBe(NOW + 1);
    expect(readRetryAt(null, { retryAt: "2026-10-12T10:01:00Z" }, NOW)).toBe(NOW + 60_000);
    expect(readRetryAt(null, { retryAfterSeconds: 3 }, NOW)).toBe(NOW + 3000);
    expect(readRetryAt("7", {}, NOW)).toBe(NOW + 7000);
    expect(readRetryAt("Mon, 12 Oct 2026 10:00:30 GMT", {}, NOW)).toBe(NOW + 30_000);
  });

  it("ignores what it cannot read", () => {
    expect(readRetryAt(null, { retryAt: "soon" }, NOW)).toBeUndefined();
    expect(readRetryAt("later", {}, NOW)).toBeUndefined();
    expect(readRetryAt(" ", {}, NOW)).toBeUndefined();
    expect(readRetryAt(undefined, {})).toBeUndefined();
  });
});

describe("problemFromResponse", () => {
  it("reads an RFC 9457 problem of krizaka-web", () => {
    const body = {
      type: "https://krizaka.com/problems/validation-failed",
      title: "Validation failed",
      status: 422,
      detail: "2 fields are invalid",
      code: "validation-failed",
      requestId: "r-1",
      errors: [
        { field: "email", code: "not-blank", message: "must not be blank" },
        { field: "email", code: "email", message: "second error of the same field" },
        { field: "age", message: "too young" },
        { message: "no field" },
        null,
      ],
    };
    const error = problemFromResponse(422, headers(), body, NOW);
    expect(error).toMatchObject({
      status: 422,
      type: body.type,
      title: "Validation failed",
      detail: "2 fields are invalid",
      code: "validation-failed",
      requestId: "r-1",
      fields: { email: { code: "not-blank", message: "must not be blank" }, age: { message: "too young" } },
      body,
    });
  });

  it("takes the code from the type when the body has none", () => {
    const error = problemFromResponse(409, headers({ "x-request-id": "h-1" }), { type: "https://krizaka.com/problems/auction-closed", title: "Auction closed" });
    expect(error.code).toBe("auction-closed");
    expect(error.requestId).toBe("h-1");
  });

  it("reads a Next.js route handler's body and a 429", () => {
    const error = problemFromResponse(429, headers({ "retry-after": "40" }), { success: false, error: "Too many requests", code: "RATE_LIMITED" }, NOW);
    expect(error).toMatchObject({ code: "RATE_LIMITED", detail: "Too many requests", retryAt: NOW + 40_000, type: "about:blank" });
  });

  it("reads zod field errors and our own fields map", () => {
    const zod = problemFromResponse(400, headers(), { error: "Invalid payload", details: { fieldErrors: { name: ["Required"], skip: "x" } } });
    expect(zod.fields).toEqual({ name: { message: "Required" } });
    const own = problemFromResponse(400, headers(), { fields: { a: "bad", b: { code: "taken", message: "already taken" }, c: 3 } });
    expect(own.fields).toEqual({ a: { message: "bad" }, b: { code: "taken", message: "already taken" } });
  });

  it("falls back on the status for anything else", () => {
    expect(problemFromResponse(500, headers(), "upstream died")).toMatchObject({ code: "server", detail: "upstream died", fields: undefined });
    expect(problemFromResponse(502, headers(), [1, 2])).toMatchObject({ code: "server", detail: undefined });
    expect(problemFromResponse(400, headers(), { code: "not a slug!", message: "m" })).toMatchObject({ code: "bad-request", detail: "m" });
    expect(problemFromResponse(404, headers(), { type: "about:blank" }).code).toBe("not-found");
    expect(problemFromResponse(404, headers(), undefined).code).toBe("not-found");
  });
});
