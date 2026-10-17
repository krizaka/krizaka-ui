import { act, fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Captcha, CaptchaDisclosure } from "./index";
import { captchaMessages } from "./messages";

type Options = Record<string, (...a: unknown[]) => void> & { sitekey: string; appearance: string; theme: string; language: string; size: string };

function fakeTurnstile() {
  const calls: Options[] = [];
  const api = {
    render: vi.fn((_el: HTMLElement, o: Options) => (calls.push(o), `w${calls.length}`)),
    remove: vi.fn(),
    reset: vi.fn(),
  };
  window.turnstile = api;
  return { api, calls };
}

afterEach(() => {
  delete window.turnstile;
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-theme");
});

describe("Captcha", () => {
  it("renders nothing without a site key", () => {
    const { api } = fakeTurnstile();
    const { container } = render(<Captcha siteKey="" onToken={() => {}} />);
    expect(container.innerHTML).toBe("");
    expect(api.render).not.toHaveBeenCalled();
  });

  it("asks Cloudflare for the quiet mode, in the page's theme and language, and passes the token up", async () => {
    document.documentElement.classList.add("light");
    const { calls } = fakeTurnstile();
    const onToken = vi.fn();
    const { container } = render(<Captcha siteKey="k" locale="fr" onToken={onToken} />);
    await act(async () => {});
    expect(calls[0]).toMatchObject({ sitekey: "k", appearance: "interaction-only", size: "flexible", theme: "light", language: "fr" });
    act(() => calls[0].callback("tok"));
    expect(onToken).toHaveBeenLastCalledWith("tok");
    act(() => calls[0]["expired-callback"]());
    expect(onToken).toHaveBeenLastCalledWith(null);
    expect(container.querySelector("[data-captcha]").getAttribute("data-captcha")).toBe("idle");
    expect(screen.getByRole("group", { name: captchaMessages.fr.group })).toBeTruthy();
  });

  it("shows nothing until a challenge needs the visitor, then frames the box", async () => {
    const { calls } = fakeTurnstile();
    const { container } = render(<Captcha siteKey="k" onToken={() => {}} />);
    await act(async () => {});
    const box = container.querySelector("[data-captcha] > div:last-child") as HTMLElement;
    expect(box.style.height).toBe("0px");
    act(() => calls[0]["before-interactive-callback"]());
    expect(container.querySelector("[data-captcha]").getAttribute("data-captcha")).toBe("interactive");
    expect(box.className).toContain("rounded-lg");
    expect(box.style.height).toBe("");
    act(() => calls[0]["after-interactive-callback"]());
    expect(container.querySelector("[data-captcha]").getAttribute("data-captcha")).toBe("idle");
  });

  it("says an accessible error and retries", async () => {
    const { api, calls } = fakeTurnstile();
    const onToken = vi.fn();
    render(<Captcha siteKey="k" onToken={onToken} />);
    await act(async () => {});
    act(() => calls[0]["error-callback"]());
    expect(onToken).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("alert").textContent).toContain(captchaMessages.en.error);
    fireEvent.click(screen.getByRole("button", { name: captchaMessages.en.retry }));
    await act(async () => {});
    expect(api.render).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("draws again, in the other theme, when the page flips", async () => {
    const { calls } = fakeTurnstile();
    const onToken = vi.fn();
    render(<Captcha siteKey="k" onToken={onToken} />);
    await act(async () => {});
    expect(calls[0].theme).toBe("dark");
    await act(async () => {
      document.documentElement.classList.add("light");
    });
    await act(async () => {});
    expect(calls.at(-1)!.theme).toBe("light");
    expect(onToken).toHaveBeenLastCalledWith(null);
  });

  it("removes the widget on unmount", async () => {
    const { api } = fakeTurnstile();
    const { unmount } = render(<Captcha siteKey="k" onToken={() => {}} />);
    await act(async () => {});
    unmount();
    expect(api.remove).toHaveBeenCalledWith("w1");
  });
});

describe("CaptchaDisclosure", () => {
  it("says the line with Cloudflare's links, in English and French, with no axe violation", async () => {
    const { container, rerender } = render(<CaptchaDisclosure />);
    expect(container.textContent).toBe("Protected by Cloudflare Turnstile · Privacy · Terms");
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["https://www.cloudflare.com/privacypolicy/", "https://www.cloudflare.com/website-terms/"]);
    expect(links[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(await axeViolations(container)).toEqual([]);
    rerender(<CaptchaDisclosure locale="fr" />);
    expect(container.textContent).toBe("Protégé par Cloudflare Turnstile · Confidentialité · Conditions");
  });
});
