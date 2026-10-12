"use client";

import { VirtualList } from "@krizaka/ui/virtual";
import { useState } from "react";

type Post = { id: string; text: string };
const page = (from: number): Post[] => Array.from({ length: 20 }, (_, i) => ({ id: `p${from + i}`, text: `Post ${from + i + 1}` }));

// A feed that scrolls the page itself (`scroll="window"`): 20 more posts each time the end comes near.
export default function VirtualFeed() {
  const [posts, setPosts] = useState(() => page(0));
  return (
    <VirtualList
      items={posts}
      getKey={(p) => p.id}
      estimateSize={72}
      gap={8}
      scroll="window"
      label="Feed"
      onEndReached={() => setPosts((all) => [...all, ...page(all.length)])}
      renderItem={(p) => <div className="rounded-xl border border-border-default bg-surface-1 p-4 text-sm text-fg">{p.text}</div>}
    />
  );
}
