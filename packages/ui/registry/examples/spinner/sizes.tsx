import { Spinner } from "@krizaka/ui/spinner";

// The minimal API, last: `size` sm · md · lg; the colour is `currentColor` (the accent by default, or `className`).
export default function SpinnerSizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner label="Loading" size="sm" />
      <Spinner label="Loading" size="md" />
      <Spinner label="Loading" size="lg" />
      <Spinner label="Loading" size="lg" className="text-fg-secondary" />
    </div>
  );
}
