import { Button } from "@krizaka/ui/button";
import { WelcomeState } from "@krizaka/ui/mascot-state";

// The first step of an onboarding: the falcon keeps the account safe — the step is a second factor.
export default function MascotStateWelcome() {
  return (
    <WelcomeState
      bird="falcon"
      className="w-96"
      title="Welcome, Eric"
      description="First, protect your account with a second factor. It takes a minute."
      action={
        <Button variant="primary" size="sm">
          Protect my account
        </Button>
      }
    />
  );
}
