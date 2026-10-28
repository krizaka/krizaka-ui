import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Environment notice",
  summary:
    "A thin band above the app bar that says this deployment is a development version — its data can be reset and it is not a commercial offer — driven by the deployment's stage: it renders nothing in production.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "On every screen of a development, staging or preview deployment that people can reach (dev.<product>.com, the admin console, the phone app, the Mac app).",
    "Whenever the app must tell a visitor that what they see is not the real offer, with the stage read once from configuration.",
  ],
  whenNotToUse: [
    { when: "The announcement of a chapter on a told page (« Step 02 · Payments »).", use: "stage-banner" },
    { when: "A message about the visitor's own situation (a quota, a failure, a maintenance window).", use: "alert" },
    { when: "A transient confirmation.", use: "toast" },
  ],
  bestPractices: [
    "Read the stage once (an env var named by context, such as `APP_ENVIRONMENT`, or a setting in the database) and pass it down from the root layout: never an `if` per page.",
    "Pass the words from your messages (`@krizaka/i18n`), French first where the app defaults to French; the package ships none.",
    "Put it above the app bar, outside the content, so it never covers anything and shifts nothing (it is server-rendered with a minimum height).",
    "`environmentNotice(config)` is the rule if you need it elsewhere (a native shell, a test): it returns `null` for `production` and `prod`.",
    "Set the stage in the deployment spec of the dev environment; no production spec sets it to development.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab / Enter", action: "Reaches the link, when there is one." }],
    notes: [
      "A region named by its title (`role=region`, `aria-label`), not a live region: it is there from the first render, not an event.",
      "Its colours are the warning tint over the surface and the text roles (readable in dark and light); there is no motion.",
      "It cannot be dismissed: the line is part of the page for as long as the stage is not production.",
    ],
  },
  related: ["alert", "stage-banner", "app-header", "nav-bar"],
  web: {
    imports: ["EnvironmentNotice", "environmentNotice"],
    examples: [
      { name: "development", title: "A development version", description: "The band above the app bar, with its line and a link; the stage `development` shows it, `production` renders nothing." },
      { name: "staging", title: "Another stage", description: "Any stage but production shows the notice; the words are the app's." },
    ],
  },
  native: {
    imports: ["EnvironmentNotice"],
    differences: [
      "The link is `onLinkPress` (the app opens it); there is no `linkAs`.",
      "Place it above the screen's header, inside the safe area your layout already applies.",
    ],
    examples: [{ name: "development", title: "A development version", description: "The band above the header with its line and a link." }],
  },
} satisfies ComponentMeta;
