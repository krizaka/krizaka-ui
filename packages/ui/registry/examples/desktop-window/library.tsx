"use client";

import { ProductLogo } from "@krizaka/ui";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DesktopWindow, useDesktopCommands } from "@krizaka/ui/desktop-window";
import { useState } from "react";

const FILES = ["Lease — 12 rue Fleury", "Payslips — Ada Roy", "ID — Noor Khan", "Lease — 8 av. du Parc"];

// TEMPLATE — The window of a Mac app: sidebar · content · inspector, resizable (drag a divider, or focus it and use the
// arrows) and collapsible (⌘B, ⌘I, the toolbar). The commands are written once: the menu bar gets them from `menus` and
// `handlers` (`setNativeMenu(bridge, { labels, menus }, handlers)` of @krizaka/app-desktop), the page answers the same keys.
export default function DesktopWindowLibrary() {
  const [sidebar, setSidebar] = useState(true);
  const [inspector, setInspector] = useState(true);
  const [current, setCurrent] = useState(0);
  useDesktopCommands([
    { id: "view.sidebar", menu: "View", label: sidebar ? "Hide sidebar" : "Show sidebar", shortcut: "mod+b", run: () => setSidebar(!sidebar) },
    { id: "view.inspector", menu: "View", label: inspector ? "Hide inspector" : "Show inspector", shortcut: "mod+i", run: () => setInspector(!inspector) },
  ]);
  return (
    <DesktopWindow
      className="[--kz-window-height:34rem]"
      shortcuts={{ sidebar: false, inspector: false }}
      sidebarOpen={sidebar}
      onSidebarOpenChange={setSidebar}
      inspectorOpen={inspector}
      onInspectorOpenChange={setInspector}
      labels={{ sidebar: "Library", inspector: "Details", resizeSidebar: "Resize the sidebar", resizeInspector: "Resize the inspector", toggleSidebar: "Show or hide the sidebar", toggleInspector: "Show or hide the inspector" }}
      title="Applicant files"
      toolbarEnd={<Button size="sm" variant="primary">New file</Button>}
      sidebar={
        <div className="flex flex-col gap-0.5 p-2">
          <div className="flex items-center gap-2 px-2 py-1.5 font-semibold"><ProductLogo id="yomizaka" size={18} animated={false} /> Yomizaka</div>
          {["All files", "To decide", "Verified"].map((name, i) => (
            <button key={name} type="button" aria-current={i === 0 ? "page" : undefined} className="h-8 cursor-default rounded-md px-2 text-start hover:bg-surface-2 aria-[current=page]:bg-accent-soft">{name}</button>
          ))}
        </div>
      }
      inspector={
        <div className="space-y-2 p-4">
          <p className="text-xs font-semibold text-fg-secondary">Details</p>
          <p className="font-semibold">{FILES[current]}</p>
          <Badge tone="success" dot>Verified</Badge>
        </div>
      }
    >
      <ul className="divide-y divide-border-subtle">
        {FILES.map((file, i) => (
          <li key={file}>
            <button type="button" aria-pressed={i === current} onClick={() => setCurrent(i)} className="block h-9 w-full cursor-default truncate px-4 text-start hover:bg-surface-2 aria-pressed:bg-accent-soft">{file}</button>
          </li>
        ))}
      </ul>
    </DesktopWindow>
  );
}
