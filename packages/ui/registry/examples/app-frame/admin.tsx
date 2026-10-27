"use client";

import { ProductLogo } from "@krizaka/ui";
import { AppFrame } from "@krizaka/ui/app-frame";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

// The administration's frame (`variant="admin"`): the same bar and menu, a chip that says where you are, and no way into the administration offered again.
export default function AppFrameAdmin() {
  return (
    <AppFrame
      variant="admin"
      name="Akinaza"
      accent="akinaza"
      mark={<ProductLogo id="akinaza" size={26} animated={false} />}
      homeHref="#overview"
      locale="fr"
      currentId="users"
      sections={[
        { id: "overview", label: "Vue d'ensemble", href: "#overview", icon: icon("M4 11 12 4l8 7v9H4z") },
        { id: "users", label: "Personnes", href: "#users", icon: icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0") },
        { id: "audit", label: "Journal d'audit", href: "#audit", icon: icon("M5 4h14v16H5zM9 9h6M9 13h6") },
      ]}
      account={{ name: "Nadia", email: "nadia@example.com", links: { profile: { href: "#profile" }, settings: { href: "#settings" }, administration: { href: "#admin" } }, onSignOut: () => {} }}
    >
      <main id="content" tabIndex={-1} className="p-4 text-sm text-fg-secondary md:p-6">Les personnes inscrites.</main>
    </AppFrame>
  );
}
