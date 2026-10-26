import { EnvironmentNotice } from "@krizaka/ui/environment-notice";

// The stage comes from configuration, read once in the root layout (here a constant for the example).
const stage = "development";

export default function EnvironmentNoticeDevelopment() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default">
      <EnvironmentNotice stage={stage} title="Development version" message="Data can be reset at any time. Not a commercial offer." link={{ label: "What this means", href: "#development" }} />
      <div className="bg-surface-1 p-4 text-sm text-fg-secondary">The app bar and the page follow.</div>
    </div>
  );
}
