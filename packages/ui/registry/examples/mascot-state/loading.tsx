import { LoadingState } from "@krizaka/ui/mascot-state";

// A job of a few minutes, in a card: the duck builds; the words say what runs.
export default function MascotStateLoading() {
  return (
    <LoadingState
      bird="duck"
      size="sm"
      layout="inline"
      framed
      className="w-96"
      title="Building the preview"
      description="About two minutes. You can leave this page."
    />
  );
}
