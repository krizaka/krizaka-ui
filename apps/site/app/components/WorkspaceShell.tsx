import type { ReactNode } from "react";

import { packageVersion } from "@/lib/package-version";

import { FieldsShortcut } from "./builder/FieldsShortcut";
import { SiteBar } from "./SiteBar";

/* The layout of a workspace page (the route group `(workspace)` of each language — the builder demo): the site's bar, no
   docs menu, no table of contents — the whole width and height belong to the tool. The first tab stop is the shortcut to
   its first field. The docs pages have DocsShell. */
export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <>
      <FieldsShortcut />
      {/* A hairline that fills as the page is read (globals.css; scroll-driven, absent under reduced motion). */}
      <div className="kz-read-progress" aria-hidden />
      <SiteBar version={packageVersion("ui")} />
      {children}
    </>
  );
}
