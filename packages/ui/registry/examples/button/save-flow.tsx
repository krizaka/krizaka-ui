"use client";
import { Button } from "@krizaka/ui/button";
import { useState } from "react";

// A save that runs, then confirms: the glyph traces the wait, a check draws itself, the result is announced.
export default function ButtonSaveFlow() {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const save = () => {
    setState("saving");
    setTimeout(() => setState("saved"), 1400);
    setTimeout(() => setState("idle"), 3400);
  };
  return (
    <Button
      variant="primary"
      loading={state === "saving"}
      status={state === "saved" ? "success" : null}
      announce={state === "saved" ? "Changes saved" : ""}
      onClick={save}
    >
      {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Save changes"}
    </Button>
  );
}
