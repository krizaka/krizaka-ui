"use client";

import { ConfirmButton } from "@krizaka/ui/confirm-button";

// With words: once armed, `armedContent` replaces them.
export default function ConfirmButtonWithText() {
  return (
    <ConfirmButton variant="outline" confirmLabel="Leave for good?" armedContent="Leave for good?" onConfirm={() => {}}>
      Leave the group
    </ConfirmButton>
  );
}
