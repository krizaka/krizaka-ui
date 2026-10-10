import { Alert } from "@krizaka/ui/alert";

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function AlertSuccess() {
  return (
    <Alert tone="success" icon={CHECK} title="Account verified">
      You can now receive payouts.
    </Alert>
  );
}
