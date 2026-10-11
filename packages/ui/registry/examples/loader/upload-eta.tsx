import { Loader } from "@krizaka/ui/loader";

// A determinate wait with its time left: the trace grows, the percentage and the ETA read in tabular figures.
export default function LoaderUploadEta() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border-default bg-surface-1 p-4">
      <Loader label="Uploading “Night walk.mp4”" value={0.62} eta="About 40 s left" delay={0} />
    </div>
  );
}
