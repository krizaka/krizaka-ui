"use client";

import { configureKrizakaFetch, KrizakaQueryProvider } from "@krizaka/query";
import { KrizakaDevtools } from "@krizaka/query/devtools";
import type { ReactNode } from "react";

// Same-origin API: the session cookie travels by itself. A cross-origin API would add `credentials: "include"`.
configureKrizakaFetch({ headers: { "x-client": "web" } });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <KrizakaQueryProvider onUnauthorized={() => window.location.assign("/sign-in")}>
      {children}
      <KrizakaDevtools />
    </KrizakaQueryProvider>
  );
}
