"use client";

import { type TreeNode, TreeView } from "@krizaka/ui/tree-view";
import { useState } from "react";

// A studio's datasets: a branch loads its files when it opens (here after 600 ms).
export default function TreeViewLazy() {
  const [nodes, setNodes] = useState<TreeNode[]>([
    { id: "voices", label: "Voices", hasChildren: true, meta: "3" },
    { id: "glossaries", label: "Glossaries", hasChildren: true, meta: "2" },
    { id: "readme", label: "README.md" },
  ]);
  const load = (node: TreeNode) =>
    setTimeout(() => {
      const files = Array.from({ length: Number(node.meta) }, (_, i) => ({ id: `${node.id}-${i}`, label: `${node.label.toLowerCase()}-${i + 1}.json` }));
      setNodes((all) => all.map((n) => (n.id === node.id ? { ...n, children: files } : n)));
    }, 600);
  return <TreeView aria-label="Datasets" nodes={nodes} onLoadChildren={load} loadingLabel="Loading the files" className="max-w-xs" />;
}
