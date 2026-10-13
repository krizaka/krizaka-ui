import { VerifiedBadge } from "@krizaka/ui/verified-badge";

// A seal beside a name, or with its words.
export default function VerifiedBadgeVerified() {
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 flex items-center gap-1.5 font-display text-lg font-bold text-fg">
        Elena Ruiz <VerifiedBadge label="Verified profile" size="lg" />
      </p>
      <VerifiedBadge label="Verified with a selfie" showLabel />
    </div>
  );
}
