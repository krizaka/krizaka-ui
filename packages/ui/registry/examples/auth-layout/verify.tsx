import { ProductLogo } from "@krizaka/ui";
import { AuthLayout } from "@krizaka/ui/auth-layout";
import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";

// The smallest entry screen: no promise, the brand panel still carries the product's gradient on a desktop.
export default function AuthLayoutVerify() {
  return (
    <AuthLayout brand={<><ProductLogo id="krizaka" size={28} animated={false} /> Krizaka</>} title="Check your email" description="We sent a 6-digit code to eric@tremblay.ca.">
      <form className="flex flex-col gap-4">
        <Field.Root>
          <Field.Label htmlFor="verify-code">Code</Field.Label>
          <Input id="verify-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
        </Field.Root>
        <Button type="submit" variant="primary" size="lg" shape="cut" className="w-full">Verify</Button>
      </form>
    </AuthLayout>
  );
}
