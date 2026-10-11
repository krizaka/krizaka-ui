import { Button } from "@krizaka/ui/button";
import { ErrorState } from "@krizaka/ui/mascot-state";

// A page that does not exist: the owl read everywhere and did not find it; the way back is the action.
export default function MascotStateError() {
  return (
    <ErrorState
      bird="owl"
      size="lg"
      titleAs="h1"
      className="w-96"
      title="This page does not exist"
      description="The link may be old, or the page has moved."
      action={
        <Button variant="secondary" size="sm">
          Back to the home page
        </Button>
      }
    />
  );
}
