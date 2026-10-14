import "./globals.css";

import { ThemeScript } from "@krizaka/ui/theme";
import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/app/fonts";
import { getDictionary } from "@/lib/i18n";

/* The 404 of both languages (two root layouts, so one global page): English words, a way back to the catalogue — an old
   krizaka.com/docs/ui link is redirected by krizaka.com itself before it gets here. */
const t = getDictionary("en").site.notFound;

export const metadata: Metadata = { title: `${t.title} · Krizaka UI`, robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} dark`} suppressHydrationWarning>
      <head>
        <ThemeScript defaultMode="dark" />
      </head>
      <body className="kz-not-found">
        <main>
          <p className="kz-not-found-code">404</p>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <Link href="/">{t.home} →</Link>
        </main>
      </body>
    </html>
  );
}
