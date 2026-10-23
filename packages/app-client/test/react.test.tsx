// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createSessionStore, type KeyValueStorage } from "../src";
import { AUTH, createAuth, useSessionStatus } from "../src/react";

afterEach(cleanup);

function memory(initial: Record<string, string> = {}): KeyValueStorage {
  const data = new Map(Object.entries(initial));
  return {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => void data.set(key, value),
    remove: async (key) => void data.delete(key),
  };
}

const TOKEN = "yz_sess_3f9a1c0b7e2d4a5f8c6b";

describe("createAuth", () => {
  it("reads the stored session, then follows a sign-in and a sign-out (a 401 that clears the token included)", async () => {
    const session = createSessionStore({ storage: memory(), key: "yomizaka.session" });
    const signIn = vi.fn(async () => session.saveToken(TOKEN));
    const signOut = vi.fn(async () => session.clearToken());
    const { AuthProvider, useAuth } = createAuth(session, { signIn, signOut });
    let auth: ReturnType<typeof useAuth> | undefined;
    function Probe() {
      auth = useAuth();
      return <p>{auth.status}</p>;
    }
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByText(AUTH.loading)).toBeTruthy();
    expect(await screen.findByText(AUTH.signedOut)).toBeTruthy();
    await act(() => auth!.signIn("eric@example.com", "secret"));
    expect(signIn).toHaveBeenCalledWith("eric@example.com", "secret");
    expect(await screen.findByText(AUTH.signedIn)).toBeTruthy();
    await act(() => session.clearToken());
    expect(await screen.findByText(AUTH.signedOut)).toBeTruthy();
    await act(() => session.saveToken(TOKEN));
    await act(() => auth!.signOut());
    expect(signOut).toHaveBeenCalled();
    expect(await screen.findByText(AUTH.signedOut)).toBeTruthy();
  });

  it("starts signed in when a token is stored", async () => {
    const session = createSessionStore({ storage: memory({ "akinaza.session": TOKEN }), key: "akinaza.session" });
    const { AuthProvider, useAuth } = createAuth(session, { signIn: async () => undefined, signOut: async () => undefined });
    function Probe() {
      return <p>{useAuth().status}</p>;
    }
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(await screen.findByText(AUTH.signedIn)).toBeTruthy();
  });

  it("refuses useAuth outside its provider", () => {
    const { useAuth } = createAuth({ readToken: async () => null, onChange: () => () => undefined }, { signIn: async () => undefined, signOut: async () => undefined });
    function Lost() {
      useAuth();
      return null;
    }
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Lost />)).toThrow(/inside <AuthProvider>/);
  });
});

describe("useSessionStatus", () => {
  it("reads a store that fails as signed out, and stops listening when unmounted", async () => {
    const stop = vi.fn();
    const session = { readToken: () => Promise.reject(new Error("keychain locked")), onChange: vi.fn(() => stop) };
    function Probe() {
      return <p>{useSessionStatus(session)}</p>;
    }
    const view = render(<Probe />);
    expect(await screen.findByText(AUTH.signedOut)).toBeTruthy();
    view.unmount();
    expect(stop).toHaveBeenCalled();
  });

  it("ignores an answer that arrives after unmounting", async () => {
    let answer: (token: string | null) => void = () => undefined;
    const session = { readToken: () => new Promise<string | null>((resolve) => (answer = resolve)), onChange: () => () => undefined };
    function Probe() {
      return <p>{useSessionStatus(session)}</p>;
    }
    const view = render(<Probe />);
    view.unmount();
    await act(async () => answer(TOKEN));
    expect(screen.queryByText(AUTH.signedIn)).toBeNull();
  });

  it("keeps the latest read when two answer out of order (a sign-out while the first read is pending)", async () => {
    const answers: ((token: string | null) => void)[] = [];
    let changed = () => undefined as void;
    const session = {
      readToken: () => new Promise<string | null>((resolve) => answers.push(resolve)),
      onChange: (listener: () => void) => ((changed = listener), () => undefined),
    };
    function Probe() {
      return <p>{useSessionStatus(session)}</p>;
    }
    render(<Probe />);
    act(() => changed());
    await act(async () => answers[1]!(null));
    await act(async () => answers[0]!(TOKEN));
    expect(screen.getByText(AUTH.signedOut)).toBeTruthy();
  });
});
