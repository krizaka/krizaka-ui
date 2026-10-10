import { Spinner } from "@krizaka/ui/spinner";

export default function SpinnerSizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner label="Loading" size="sm" />
      <Spinner label="Loading" size="md" />
      <Spinner label="Loading" size="lg" />
    </div>
  );
}
