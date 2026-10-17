// Client: loads the Cloudflare script and draws the widget in an effect.
import { useCallback, useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

import { Button } from "../button";
import { type CaptchaLabels, labelsFor } from "./messages";
import { loadTurnstile, pageTheme, TURNSTILE_PRIVACY, TURNSTILE_TERMS } from "./turnstile";

const captcha = tv({
  slots: {
    root: "w-full",
    frame: "overflow-hidden rounded-lg border border-border-default bg-surface-2 p-2",
    error: "flex flex-wrap items-center gap-3 rounded-lg border border-border-default bg-surface-2 p-3 text-sm text-fg-danger",
    disclosure: "text-xs text-fg-muted",
    link: "underline underline-offset-2 hover:text-fg-secondary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
  },
});

export type CaptchaProps = {
  /** The widget's public site key. Empty → nothing is rendered and no token is asked (local dev, tests). */
  siteKey: string;
  /** The token once the check passes; `null` when it expires, fails or the theme redraws the widget. */
  onToken: (token: string | null) => void;
  /**
   * The language of the widget and of the words: `"en"`, `"fr"`…
   * @default "en"
   */
  locale?: string;
  /**
   * `auto` follows the page (`html.light` / `data-theme`, redrawn when it flips).
   * @default "auto"
   */
  theme?: "auto" | "light" | "dark";
  /** Words to say otherwise; the rest comes from the locale. */
  labels?: Partial<CaptchaLabels>;
  /** Classes added to the root. */
  className?: string;
};

/**
 * The bot check of a public form, Cloudflare Turnstile that stays out of the way: managed mode with
 * `appearance: "interaction-only"`, so a normal visitor sees nothing — the check runs in the background and `onToken`
 * fires. Only when Cloudflare needs the visitor does a framed box appear, on the tokens (radius, border, theme).
 * If the check cannot run, an alert with a retry button replaces it. Pair it with `CaptchaDisclosure` under the submit.
 */
export function Captcha({ siteKey, onToken, locale = "en", theme = "auto", labels, className }: CaptchaProps) {
  const host = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });
  const [interactive, setInteractive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const words = labelsFor(locale, labels);
  const { root, frame, error } = captcha();

  useEffect(() => {
    if (!siteKey || !host.current) return;
    const el = host.current;
    let cancelled = false;
    const fail = () => {
      onTokenRef.current(null);
      setInteractive(false);
      setFailed(true);
    };
    const mount = () => {
      loadTurnstile().then((api) => {
        if (cancelled) return;
        if (widget.current) api.remove(widget.current);
        widget.current = api.render(el, {
          sitekey: siteKey,
          appearance: "interaction-only",
          size: "flexible",
          theme: theme === "auto" ? pageTheme() : theme,
          language: locale,
          callback: (token: string) => {
            setFailed(false);
            onTokenRef.current(token);
          },
          "expired-callback": () => onTokenRef.current(null),
          "before-interactive-callback": () => setInteractive(true),
          "after-interactive-callback": () => setInteractive(false),
          "error-callback": fail,
          "unsupported-callback": fail,
        });
      }, fail);
    };
    setFailed(false);
    mount();
    const watcher = theme === "auto" ? new MutationObserver(() => { onTokenRef.current(null); mount(); }) : null;
    watcher?.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => {
      cancelled = true;
      watcher?.disconnect();
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, locale, theme, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (!siteKey) return null;
  return (
    <div className={root({ className })} role="group" aria-label={words.group} data-captcha={failed ? "error" : interactive ? "interactive" : "idle"}>
      {failed ? (
        <div role="alert" className={error()}>
          <span>{words.error}</span>
          <Button type="button" size="sm" variant="secondary" onClick={retry}>
            {words.retry}
          </Button>
        </div>
      ) : null}
      {/* Always mounted (Cloudflare draws into it); framed and visible only when a challenge needs the visitor. */}
      <div className={interactive && !failed ? frame() : undefined} hidden={failed} style={interactive ? undefined : { height: 0, overflow: "hidden" }}>
        <div ref={host} />
      </div>
    </div>
  );
}

export type CaptchaDisclosureProps = {
  /**
   * The language of the line: `"en"`, `"fr"`…
   * @default "en"
   */
  locale?: string;
  /** Words to say otherwise; the rest comes from the locale. */
  labels?: Partial<CaptchaLabels>;
  /** The privacy link; Cloudflare's privacy policy by default. */
  privacyHref?: string;
  /** The terms link; Cloudflare's website terms by default. */
  termsHref?: string;
  /** Classes added to the root. */
  className?: string;
};

/** « Protected by Cloudflare Turnstile · Privacy · Terms »: the line Cloudflare's terms ask for under the submit button. */
export function CaptchaDisclosure({ locale = "en", labels, privacyHref = TURNSTILE_PRIVACY, termsHref = TURNSTILE_TERMS, className }: CaptchaDisclosureProps) {
  const words = labelsFor(locale, labels);
  const { disclosure, link } = captcha();
  return (
    <p className={disclosure({ className })}>
      {words.protectedBy} · <a className={link()} href={privacyHref} target="_blank" rel="noopener noreferrer">{words.privacy}</a> ·{" "}
      <a className={link()} href={termsHref} target="_blank" rel="noopener noreferrer">{words.terms}</a>
    </p>
  );
}
