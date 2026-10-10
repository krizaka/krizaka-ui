import { Button } from "@krizaka/ui/native";

export default function NativeButtonSizes() {
  return (
    <>
      <Button variant="primary" size="sm" label="Continue" />
      <Button variant="primary" size="md" label="Continue" />
      <Button variant="primary" size="lg" shape="pill" label="Continue" />
    </>
  );
}
