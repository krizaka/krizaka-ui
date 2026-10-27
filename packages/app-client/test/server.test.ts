import { cookieValue, sessionTokenOf, signInClientOf } from "../src/server";

const token = "abc.def-123";

describe("sessionTokenOf", () => {
  it("reads the web's cookie among others", () => {
    expect(sessionTokenOf(new Headers({ cookie: `a=b; app_session=${token}; c=d` }), "app_session")).toBe(token);
  });

  it("reads a native app's bearer, whatever the case of the scheme", () => {
    expect(sessionTokenOf(new Headers({ authorization: `Bearer ${token}` }), "app_session")).toBe(token);
    expect(sessionTokenOf(new Headers({ authorization: `bearer ${token}` }), "app_session")).toBe(token);
  });

  it("the bearer wins over a stale cookie", () => {
    expect(sessionTokenOf(new Headers({ authorization: `Bearer ${token}`, cookie: "app_session=stale" }), "app_session")).toBe(token);
  });

  it("is undefined with neither, with another scheme, with a malformed bearer, or another cookie's name", () => {
    expect(sessionTokenOf(new Headers(), "app_session")).toBeUndefined();
    expect(sessionTokenOf(new Headers({ authorization: `Basic ${token}` }), "app_session")).toBeUndefined();
    expect(sessionTokenOf(new Headers({ authorization: "Bearer a b" }), "app_session")).toBeUndefined();
    expect(sessionTokenOf(new Headers({ cookie: `other_session=${token}` }), "app_session")).toBeUndefined();
  });

  it("falls back to the cookie when the bearer is not one", () => {
    expect(sessionTokenOf(new Headers({ authorization: "Basic x", cookie: `app_session=${token}` }), "app_session")).toBe(token);
  });
});

describe("cookieValue", () => {
  it("finds a cookie by its exact name, not by a prefix of another", () => {
    expect(cookieValue(`app_session_old=1; app_session=2`, "app_session")).toBe("2");
    expect(cookieValue(null, "app_session")).toBeUndefined();
  });
});

describe("signInClientOf", () => {
  it("is native only when the body says so", () => {
    expect(signInClientOf({ client: "native", email: "a@b.c" })).toBe("native");
    expect(signInClientOf({ client: "web" })).toBe("web");
    expect(signInClientOf({})).toBe("web");
    expect(signInClientOf(null)).toBe("web");
    expect(signInClientOf("native")).toBe("web");
  });
});
