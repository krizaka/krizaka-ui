import { Alert } from "@krizaka/ui/alert";
import { Button } from "@krizaka/ui/button";

const WARN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </svg>
);

export default function AlertDanger() {
  return (
    <Alert
      tone="danger"
      icon={WARN}
      title="Payment failed"
      action={
        <Button size="sm" variant="danger">
          Retry
        </Button>
      }
    >
      The card was declined. Try another one.
    </Alert>
  );
}
