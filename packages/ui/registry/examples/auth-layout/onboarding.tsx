import { ProductLogo } from "@krizaka/ui";
import { AuthLayout } from "@krizaka/ui/auth-layout";
import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";
import { Stepper } from "@krizaka/ui/stepper";

const labels = { done: "Done", current: "Current step", upcoming: "Upcoming", error: "Failed" };

// TEMPLATE — onboarding a creator (Orochia): the steps said in words above the form of the current one; the brand panel
// says why it is worth it. On a phone the steps stay horizontal and compact above the fields.
export default function AuthLayoutOnboarding() {
  return (
    <div className="brand-orochia">
      <AuthLayout
        brand={<><ProductLogo id="orochia" size={28} animated={false} /> Orochia</>}
        promise="Three steps, then your first video."
        aside={<p>Your identity is checked once, by a person, and never shown to your fans.</p>}
        asideFooter="© Krizaka · Montréal"
        title="Your payout account"
        description="Where your earnings go every Monday."
      >
        <Stepper
          aria-label="Onboarding"
          orientation="horizontal"
          labels={labels}
          current={1}
          steps={[{ title: "Profile" }, { title: "Payouts" }, { title: "Identity" }]}
        />
        <form className="flex flex-col gap-4">
          <Field.Root>
            <Field.Label htmlFor="onboarding-holder">Account holder</Field.Label>
            <Input id="onboarding-holder" autoComplete="name" defaultValue="Elena Varga" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor="onboarding-iban">IBAN</Field.Label>
            <Input id="onboarding-iban" inputMode="text" placeholder="FR76 …" aria-describedby="onboarding-iban-hint" />
            <Field.Hint id="onboarding-iban-hint">Checked before your first payout.</Field.Hint>
          </Field.Root>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="lg" shape="cut" className="flex-1">Back</Button>
            <Button type="submit" variant="primary" size="lg" shape="cut" className="flex-1">Continue</Button>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
