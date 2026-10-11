import { Button } from "@krizaka/ui/button";

// A failure, said three ways: a cross draws itself, the button shakes its head once, and the message is announced.
export default function ButtonError() {
  return (
    <Button variant="danger" status="error" announce="The payment was declined">
      Payment declined — retry
    </Button>
  );
}
