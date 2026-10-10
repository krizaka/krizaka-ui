import { EmptyState } from "@krizaka/ui/empty-state";

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m10 9 5 3-5 3z" />
  </svg>
);

export default function EmptyStateDefault() {
  return <EmptyState icon={ICON} title="No videos yet" description="The videos you publish appear here." />;
}
