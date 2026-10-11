import { Loader } from "@krizaka/ui/loader";

// Over a region that stays readable behind frosted glass: `variant="overlay"` in a `relative` parent.
export default function LoaderOverlay() {
  return (
    <div className="relative w-full max-w-sm rounded-xl border border-border-default bg-surface-1 p-5">
      <p className="font-semibold text-fg">Monthly report</p>
      <p className="mt-1 text-sm text-fg-secondary">Revenue, supporters and payouts for October.</p>
      <div className="mt-4 h-24 rounded-lg bg-surface-2" />
      <Loader variant="overlay" label="Refreshing the report" eta="A few seconds" delay={0} />
    </div>
  );
}
