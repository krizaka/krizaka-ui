import { Button } from "@krizaka/ui/button";
import { Stepper } from "@krizaka/ui/stepper";

const labels = { done: "Done", current: "In progress", upcoming: "Upcoming", error: "Failed" };

// A step that failed says so (a cross, the danger colour, “Failed” in words) and offers what to do next.
export default function StepperFailed() {
  return (
    <Stepper
      aria-label="Payout"
      labels={labels}
      current={1}
      className="w-full max-w-sm"
      steps={[
        { title: "Requested", description: "€1,240.00" },
        { title: "Bank transfer", description: "The bank refused the account number", status: "error", content: <Button size="sm" variant="outline">Update the account</Button> },
        { title: "Received" },
      ]}
    />
  );
}
