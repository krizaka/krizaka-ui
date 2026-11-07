import { Skeleton, SkeletonGroup } from "@krizaka/orazaka-design-system";

// The shape of an answer while the engine prepares it.
export default function AnswerLoading() {
  return (
    <div aria-busy="true" aria-label="Preparing the answer" className="flex w-80 gap-3">
      <Skeleton shape="circle" className="h-8 w-8 shrink-0" />
      <SkeletonGroup lines={3} className="flex-1" />
    </div>
  );
}
