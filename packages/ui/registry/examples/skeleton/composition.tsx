import { Skeleton } from "@krizaka/ui/skeleton";

export default function SkeletonComposition() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-surface-1 p-4">
      <Skeleton shape="rect" className="h-32" />
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" className="h-8" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton />
          <Skeleton className="w-2/3" />
        </div>
      </div>
    </div>
  );
}
