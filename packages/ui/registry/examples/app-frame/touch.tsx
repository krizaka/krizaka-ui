"use client";

import { ProductLogo } from "@krizaka/ui";
import { AppFrame, type FrameSection } from "@krizaka/ui/app-frame";
import { Stat } from "@krizaka/ui/stat";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const SECTIONS: FrameSection[] = [
  { id: "home", label: "Home", href: "#home", icon: icon("M4 11 12 4l8 7v9H4z") },
  { id: "checks", label: "Checks", href: "#checks", icon: icon("M5 12l4 4 10-10") },
];

// The same frame with `touchTargets`: the rail's places and mark, the home link, the search and the account are all 44 x 44 px at least.
export default function AppFrameTouch() {
  return (
    <AppFrame
      name="Yomizaka"
      accent="yomizaka"
      mark={<ProductLogo id="yomizaka" size={26} animated={false} />}
      homeHref="#home"
      sections={SECTIONS}
      currentId="home"
      search={{ label: "Search files and checks", onOpen: () => {} }}
      account={{ name: "Eric Tremblay", email: "eric@example.com", links: { settings: { href: "#settings" } }, onSignOut: () => {} }}
      theme={false}
      touchTargets
    >
      <main id="content" tabIndex={-1} className="grid gap-4 p-4 sm:grid-cols-2 md:p-6">
        <Stat label="Checks this month" value="42" />
        <Stat label="Credits left" value="58" />
      </main>
    </AppFrame>
  );
}
