import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Splash hand-off",
  summary: "The static native splash dissolves into the product's animated mark until the first screen is ready — same place, same size, same background, no flash.",
  status: "beta",
  category: "feedback",
  platforms: "native",
  whenToUse: ["The start of an app: from the launch image to the first screen, while the session and the fonts load.", "Any cold start that takes longer than the blink of an eye."],
  whenNotToUse: [
    { when: "A wait inside the app, once a screen is showing.", use: "loader" },
    { when: "A refresh the person asked for.", use: "pull-to-refresh" },
  ],
  bestPractices: [
    "Give `app.json`'s splash the same background and the mark's size (96 by default), so the hand-off does not jump.",
    "Hide the native splash in `onShown` (`SplashScreen.hideAsync()`): the animated mark is already under it.",
    "Set `ready` when the session and the fonts are there, not on a timer.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `progressbar` named by `label` (“Orochia is opening”), busy until it leaves; the first screen takes the reading order after it.",
      "Reduced motion: the mark stands still and the splash leaves without fading.",
    ],
  },
  related: ["loader", "pull-to-refresh", "screen"],
  native: {
    imports: ["SplashHandoff"],
    differences: [],
    examples: [{ name: "default", title: "Opening", description: "Orochia's animated mark on the splash's background while the app gets ready." }],
  },
} satisfies ComponentMeta;
