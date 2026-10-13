import { Button } from "@krizaka/ui/button";
import { StepProgress } from "@krizaka/ui/step-progress";

// The head of the sign-up: back, five segments, the position in words, Skip.
export default function StepProgressSignUp() {
  return (
    <StepProgress
      className="max-w-md"
      step={2}
      total={5}
      label={(n, total) => `Step ${n} of ${total}`}
      back={<Button variant="ghost" size="sm">Back</Button>}
      trailing={<Button variant="ghost" size="sm">Skip</Button>}
    />
  );
}
