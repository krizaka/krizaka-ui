import { Pagination } from "@krizaka/ui/native";

// A cursor: the range in between, no total.
export default function NativePaginationCursor() {
  return (
    <Pagination
      hasPrevious
      hasNext
      status="Payouts 21–40"
      labels={{ previous: "Newer payouts", next: "Older payouts", compact: (p, count) => `${p} / ${count}` }}
    />
  );
}
