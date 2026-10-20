import { ProductLogo } from "@krizaka/ui";
import { AuthLayout } from "@krizaka/ui/auth-layout";
import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";
import { Mascot } from "@krizaka/ui/mascots";

// TEMPLATE — Orochia's sign-in: the brand panel (its gradient, the promise, a creator's sentence) beside a calm form;
// on a phone one column, the mark above the form, the fields at full width with 44 px targets.
export default function AuthLayoutSignIn() {
  return (
    <div className="brand-orochia">
      <AuthLayout
        brand={<><ProductLogo id="orochia" size={28} animated={false} /> Orochia</>}
        promise="Your fans pay you, not an algorithm."
        aside={
          <div className="flex items-end gap-3">
            <Mascot bird="flamingo" mood="welcome" size={64} />
            <p>“90 % of every tip, unlock and auction reaches me — on Monday.” — Elena, creator</p>
          </div>
        }
        asideFooter="© Krizaka · Montréal"
        title="Welcome back"
        description="Sign in to your studio."
        footer={<>No account yet? <a className="font-semibold text-fg-accent" href="#sign-up">Create one</a></>}
        legal={<>By signing in you accept the <a className="underline" href="#terms">terms</a> and the <a className="underline" href="#privacy">privacy policy</a>.</>}
      >
        <form className="flex flex-col gap-4">
          <Field.Root>
            <Field.Label htmlFor="sign-in-email">Email</Field.Label>
            <Input id="sign-in-email" type="email" autoComplete="email" placeholder="you@example.com" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor="sign-in-password">Password</Field.Label>
            <Input id="sign-in-password" type="password" autoComplete="current-password" />
            <Field.Hint><a className="text-fg-accent" href="#reset">Forgot it?</a></Field.Hint>
          </Field.Root>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign in
          </Button>
          <Button type="button" variant="secondary" size="lg" className="w-full">
            Use a passkey
          </Button>
        </form>
      </AuthLayout>
    </div>
  );
}
