"use client";

import { ProductLogo } from "@krizaka/ui";
import { AppFrame, type FrameSection } from "@krizaka/ui/app-frame";
import { Button } from "@krizaka/ui/button";
import { Stat } from "@krizaka/ui/stat";
import type { Mode } from "@krizaka/ui/theme";
import { useState } from "react";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const SECTIONS: FrameSection[] = [
  { id: "home", label: "Home", href: "#home", icon: icon("M4 11 12 4l8 7v9H4z") },
  { id: "files", label: "Applicant files", href: "#files", icon: icon("M4 5h16v14H4zM8 9h8M8 13h5"), badge: 3, badgeLabel: "3 to decide" },
  { id: "documents", label: "Documents", href: "#documents", icon: icon("M7 3h8l4 4v14H7zM15 3v4h4") },
  { id: "checks", label: "Checks", href: "#checks", icon: icon("M5 12l4 4 10-10") },
];

// TEMPLATE — The signed-in frame of a product (Yomizaka): the rail (a tab bar on a phone), the top bar with its search, the
// one primary action and the account menu. Settings is under the avatar, so it is not a section. The product writes only its sections; the menu, its order and the preferences are the frame's.
export default function AppFrameApp() {
  const [language, setLanguage] = useState("en");
  // Inside a ThemeProvider the frame reads the theme itself; here it is passed.
  const [mode, setMode] = useState<Mode>("system");
  return (
    <AppFrame
      name="Yomizaka"
      accent="yomizaka"
      mark={<ProductLogo id="yomizaka" size={26} animated={false} />}
      headerMark={<ProductLogo id="yomizaka" size={22} animated={false} />}
      homeHref="#home"
      sections={SECTIONS}
      currentId="home"
      search={{ label: "Search files and checks", onOpen: () => {} }}
      primary={<Button size="sm" shape="cut">Check a document</Button>}
      account={{
        name: "Eric Tremblay",
        email: "eric@example.com",
        avatar: { defaultAvatar: { brand: "yomizaka", seed: "eric" } },
        links: { settings: { href: "#settings" }, profile: { href: "#profile" }, billing: { href: "#billing", label: "Credits and usage" } },
        onSignOut: () => {},
      }}
      language={{ value: language, onChange: setLanguage, options: [{ value: "en", label: "English" }, { value: "fr", label: "Français" }] }}
      theme={{ value: mode, onChange: setMode }}
    >
      <main id="content" tabIndex={-1} className="grid gap-4 p-4 sm:grid-cols-3 md:p-6">
        <Stat label="Files to decide" value="3" />
        <Stat label="Checks this month" value="42" />
        <Stat label="Credits left" value="58" />
      </main>
    </AppFrame>
  );
}
