import { Loader } from "@krizaka/ui/loader";

// How a wait ends: drawn (a check or a cross in the status colour) and announced in words.
export default function LoaderEndings() {
  return (
    <div className="flex flex-col gap-3">
      <Loader status="success" label="Publishing" successLabel="Published" endDuration={Infinity} delay={0} minDuration={0} />
      <Loader status="error" label="Publishing" errorLabel="Could not publish — check your connection" endDuration={Infinity} delay={0} minDuration={0} />
    </div>
  );
}
