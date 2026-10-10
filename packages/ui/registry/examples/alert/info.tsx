import { Alert } from "@krizaka/ui/alert";

const INFO = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
  </svg>
);

export default function AlertInfo() {
  return (
    <Alert title="New payout schedule" icon={INFO}>
      Payouts now arrive every Monday.
    </Alert>
  );
}
