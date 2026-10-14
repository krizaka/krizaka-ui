import type { ReactNode } from "react";

import { siteMetadata, SiteRoot, siteViewport } from "@/app/components/SiteRoot";

/* English, at the root of ui.krizaka.com (French has its own root layout under /fr, for <html lang>). */
export const metadata = siteMetadata("en");
export const viewport = siteViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteRoot locale="en">{children}</SiteRoot>;
}
