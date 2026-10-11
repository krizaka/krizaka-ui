import { Skeleton, SkeletonText } from "@krizaka/ui/skeleton";

// An article on its way: a title, then `SkeletonText` — lines that wrap, the last one shorter. One reflection crosses
// all of them together, like light across a page, rather than each one pulsing on its own.
export default function SkeletonParagraph() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Skeleton className="h-5 w-2/3" />
      <SkeletonText lines={4} />
    </div>
  );
}
