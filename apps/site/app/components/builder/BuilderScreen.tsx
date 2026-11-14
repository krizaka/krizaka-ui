import type { ReactNode } from "react";

/* The first screen of the workspace: the page's title above, the editor below, together exactly the height of the window
   (globals.css `.kz-builder-screen`). The editor's slot grows into what the title leaves; it never gets below 560 px. */
export function BuilderScreen({ head, children }: Readonly<{ head: ReactNode; children: ReactNode }>) {
  return (
    <div className="kz-builder-screen">
      {head}
      {children}
    </div>
  );
}
