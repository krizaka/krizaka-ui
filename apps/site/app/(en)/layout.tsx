import type { ReactNode } from "react";

import { siteMetadata, SiteRoot } from "@/app/components/SiteRoot";

/* English, at the root of ui.krizaka.com (French has its own root layout under /fr, for <html lang>). */
export const metadata = siteMetadata("en");

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <SiteRoot locale="en">{children}</SiteRoot>;
}

export { siteViewport as viewport } from "@/app/components/SiteRoot";