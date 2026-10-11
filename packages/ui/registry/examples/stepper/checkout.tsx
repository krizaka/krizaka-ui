import { Stepper } from "@krizaka/ui/stepper";

const labels = { done: "Done", current: "Current step", upcoming: "Upcoming", error: "Failed" };

// A short journey, horizontal: the connectors fill as it advances.
export default function StepperCheckout() {
  return (
    <Stepper
      aria-label="Checkout"
      orientation="horizontal"
      labels={labels}
      current={1}
      className="w-full max-w-xl"
      steps={[{ title: "Plan" }, { title: "Payment" }, { title: "Confirmation" }]}
    />
  );
}
