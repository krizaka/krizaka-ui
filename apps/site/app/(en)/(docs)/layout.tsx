import type { ReactNode } from "react";

import { DocsShell } from "@/app/components/docs/DocsShell";

export default function DocsGroupLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <DocsShell locale="en">{children}</DocsShell>;
}
