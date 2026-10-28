import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Captcha",
  summary:
    "The bot check of a public form: Cloudflare Turnstile that shows nothing to a normal visitor, a framed box on the tokens only when a challenge needs them, and an accessible error with a retry.",
  status: "beta",
  category: "forms",
  domain: "identity",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Turnstile is a web widget; a phone app proves itself with its own session." }, desktop: "web" },
  whenToUse: [
    "A public form anyone can post (contact, newsletter, sign-up) that the server verifies with Turnstile's siteverify.",
    "When the check must not weigh on the page: it runs in the background and appears only if Cloudflare asks.",
  ],
  whenNotToUse: [
    { when: "A signed-in action: the session already proves who acts." },
    { when: "A confirmation of a destructive action.", use: "confirm-button" },
  ],
  bestPractices: [
    "Verify the token on the server and fail closed: a missing or refused token is a 400, whatever the browser says.",
    "Put `CaptchaDisclosure` under the submit button: Cloudflare's terms ask for the privacy and terms links when the widget is hidden.",
    "Disable the submit while `onToken` has not given a token, and remount the component (`key`) after a refused token.",
    "Pass the site's locale; the theme follows the page (`html.light` or `data-theme`) and redraws when it flips.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Reaches the Cloudflare challenge when it shows, and the Try again button on error." }],
    notes: [
      "The widget sits in a group named by `labels.group`; a failure is announced as an alert, with a button to try again.",
      "The disclosure links open in a new tab with `rel=\"noopener noreferrer\"`.",
    ],
  },
  related: ["form", "field", "button"],
  web: {
    imports: ["Captcha", "CaptchaDisclosure"],
    examples: [
      { name: "form", title: "A form with its check", description: "The submit waits for the token; the disclosure sits under it." },
      { name: "disclosure", title: "The disclosure line", description: "« Protected by Cloudflare Turnstile · Privacy · Terms », in English or French." },
    ],
  },
} satisfies ComponentMeta;
