"use client";

import { TreeView } from "@krizaka/ui/tree-view";

const nodes = [
  {
    id: "orazaka",
    label: "Orazaka",
    children: [
      { id: "getting-started", label: "Getting started" },
      { id: "studios", label: "Studios", meta: "12", children: [{ id: "dubbing", label: "Dubbing" }, { id: "transcript", label: "Transcript" }, { id: "clips", label: "Clips" }] },
      { id: "api", label: "API reference" },
    ],
  },
  { id: "yomizaka", label: "Yomizaka", children: [{ id: "checks", label: "Checks" }, { id: "reports", label: "Reports" }] },
  { id: "ui", label: "Krizaka UI", children: [{ id: "components", label: "Components" }] },
];

// The documentation's sections: one tab stop, the arrows walk and open, a letter jumps.
export default function TreeViewDocs() {
  return <TreeView aria-label="Documentation" nodes={nodes} defaultExpanded={["orazaka", "studios"]} defaultSelected="dubbing" className="max-w-xs" />;
}
