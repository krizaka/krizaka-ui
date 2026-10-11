import { Button } from "@krizaka/ui/button";
import { MascotState } from "@krizaka/ui/mascot-state";

// An empty inbox: the pigeon has nothing to deliver yet; the action fills it.
export default function MascotStateEmpty() {
  return (
    <MascotState
      bird="pigeon"
      framed
      className="w-96"
      title="No messages yet"
      description="Answer a challenge or tip a creator to start a conversation."
      action={
        <Button variant="primary" size="sm">
          Find creators
        </Button>
      }
    />
  );
}
