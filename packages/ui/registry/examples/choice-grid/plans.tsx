"use client";

import { Emblem } from "@krizaka/ui/achievement";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { useState } from "react";

// Selectable: a radio group — one tab stop, the arrow keys move and choose.
export default function ChoiceGridPlans() {
  const [plan, setPlan] = useState("creator");
  return (
    <ChoiceGrid
      label="Choose your plan"
      tag="Step 1 of 3"
      caption="You can change it at any time."
      value={plan}
      onValueChange={setPlan}
      items={[
        { id: "starter", visual: <Emblem kind="sword" size={34} />, name: "Starter", title: "Publish and get paid" },
        { id: "creator", visual: <Emblem kind="jewel" size={34} />, name: "Creator", title: "Challenges and auctions" },
        { id: "studio", visual: <Emblem kind="mirror" size={34} />, name: "Studio", title: "A team, shared earnings" },
      ]}
    />
  );
}
