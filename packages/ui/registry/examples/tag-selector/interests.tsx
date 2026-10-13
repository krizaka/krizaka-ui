"use client";

import { TagSelector } from "@krizaka/ui/tag-selector";
import { useState } from "react";

const INTERESTS = ["Music", "Surf", "Cooking", "Hiking", "Cinema", "Climbing", "Travel", "Gaming", "Yoga", "Photography"].map((t) => ({ value: t.toLowerCase(), label: t }));

// Up to five interests: the others rest once five are chosen.
export default function TagSelectorInterests() {
  const [chosen, setChosen] = useState<string[]>(["music", "surf", "travel"]);
  return <TagSelector className="max-w-md" label="Interests" options={INTERESTS} value={chosen} onValueChange={setChosen} max={5} countLabel={(n, max) => `${n} of ${max} chosen`} />;
}
