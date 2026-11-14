import type { ReactNode } from "react";

import { DocsShell } from "@/app/components/docs/DocsShell";

export default function DocsGroupLayout({ children }: { children: ReactNode }) {
  return <DocsShell locale="fr">{children}</DocsShell>;
}
