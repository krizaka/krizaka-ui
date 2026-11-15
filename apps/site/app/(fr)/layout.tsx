import type { ReactNode } from "react";

import { siteMetadata, SiteRoot } from "@/app/components/SiteRoot";

/* French, under /fr (English is at the root, with its own root layout, for <html lang>). */
export const metadata = siteMetadata("fr");

export default function FrenchLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <SiteRoot locale="fr">{children}</SiteRoot>;
}

export { siteViewport as viewport } from "@/app/components/SiteRoot";