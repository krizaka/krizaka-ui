import { Button } from "@krizaka/ui/native";

// Disabled and busy: a spinner takes the place of the icon.
export default function NativeButtonLoading() {
  return <Button variant="primary" label="Saving…" loading />;
}
