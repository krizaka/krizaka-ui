import { Button } from "@krizaka/ui/button";
import { SuccessState } from "@krizaka/ui/mascot-state";

// A payment received: the flamingo gets paid and answers; the receipt is the next step.
export default function MascotStateSuccess() {
  return (
    <SuccessState
      bird="flamingo"
      className="w-96"
      title="Payment received"
      description="120 credits are on your balance. The receipt is in your email."
      action={
        <Button variant="secondary" size="sm">
          See the receipt
        </Button>
      }
    />
  );
}
