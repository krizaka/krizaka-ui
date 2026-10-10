import { Spinner } from "@krizaka/ui/spinner";

// The colour follows `className` (here a text role).
export default function SpinnerMuted() {
  return <Spinner label="Loading" className="text-fg-secondary" />;
}
