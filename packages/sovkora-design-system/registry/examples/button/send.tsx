"use client";

import { Button } from "@krizaka/sovkora-design-system";
import { useState } from "react";

// Primary by default (the 1.x default); locked while the answer is generated (ERR-126).
export default function Send() {
  const [generating, setGenerating] = useState(false);
  const send = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };
  return (
    <Button loading={generating} disabled={generating} onClick={send}>
      Send
    </Button>
  );
}
