"use client";

import { ConfirmButton } from "@krizaka/ui/confirm-button";

// Press once: it arms and says what will happen (`confirmLabel`); press again within `timeoutMs` to confirm.
export default function ConfirmButtonArmed() {
  return (
    <ConfirmButton label="Delete the comment" confirmLabel="Delete?" size="sm" timeoutMs={600_000} onConfirm={() => {}}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      </svg>
    </ConfirmButton>
  );
}
