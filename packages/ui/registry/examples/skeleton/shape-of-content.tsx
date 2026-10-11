import { SkeletonShape } from "@krizaka/ui/skeleton";

function CreatorCard({ name, line }: { name: string; line: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-4">
      <span data-skeleton aria-hidden className="h-10 w-10 shrink-0 rounded-full bg-accent-soft" />
      <div className="min-w-0">
        <p className="font-semibold text-fg">{name}</p>
        <p className="text-sm text-fg-secondary">{line}</p>
      </div>
    </div>
  );
}

// The skeleton of the real card: the same component with placeholder words, its text and media turned into shapes.
// The layout is exact — nothing drawn twice, nothing jumps when the data arrives. `data-skeleton` marks any other shape.
export default function SkeletonShapeOfContent() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SkeletonShape>
        <CreatorCard name="Placeholder name" line="Placeholder supporters line" />
      </SkeletonShape>
      <CreatorCard name="Eric Moreau" line="1,204 supporters · Paris" />
    </div>
  );
}
