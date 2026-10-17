"use client";

import { AccountMenu } from "@krizaka/ui/account-menu";
import { useState } from "react";

export default function AccountMenuDefault() {
  const [language, setLanguage] = useState("en");
  return (
    <AccountMenu
      label="Account"
      name="Eric Tremblay"
      email="eric@orazaka.io"
      avatar={{ defaultAvatar: { brand: "orazaka", seed: "eric" } }}
      links={[
        { id: "profile", label: "Profile", href: "#profile" },
        { id: "settings", label: "Settings", href: "#settings" },
      ]}
      language={{ label: "Language", value: language, options: [{ value: "en", label: "English" }, { value: "fr", label: "Français" }], onChange: setLanguage }}
      signOut={{ label: "Sign out", onSelect: () => {} }}
    />
  );
}
