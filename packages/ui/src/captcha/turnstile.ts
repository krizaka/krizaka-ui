/** The Cloudflare Turnstile browser API, loaded once, on demand. */
export interface TurnstileApi {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
  reset(id: string): void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
export const TURNSTILE_PRIVACY = "https://www.cloudflare.com/privacypolicy/";
export const TURNSTILE_TERMS = "https://www.cloudflare.com/website-terms/";

let loading: Promise<TurnstileApi> | null = null;

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = TURNSTILE_SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile"));
    };
    try {
      document.head.appendChild(s);
    } catch {
      loading = null;
      reject(new Error("turnstile"));
    }
  });
  return loading;
}

/** The page's theme: `html.light` or `data-theme="light"` is light, anything else dark. */
export function pageTheme(): "light" | "dark" {
  const root = document.documentElement;
  return root.classList.contains("light") || root.dataset.theme === "light" ? "light" : "dark";
}
