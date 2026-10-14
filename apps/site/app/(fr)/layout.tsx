import type { ReactNode } from "react";

import { siteMetadata, SiteRoot, siteViewport } from "@/app/components/SiteRoot";

/* French, under /fr (English is at the root, with its own root layout, for <html lang>). */
export const metadata = siteMetadata("fr");
export const viewport = siteViewport;

export default function FrenchLayout({ children }: { children: ReactNode }) {
  return <SiteRoot locale="fr">{children}</SiteRoot>;
}
