import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";

// A question the user must answer: no close button, Escape and the overlay do nothing — it closes through its actions.
export default function DialogGate({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger asChild>
        <Button>Enter the channel</Button>
      </Dialog.Trigger>
      <Dialog.Content hideClose dismissible={false} size="sm">
        <Dialog.Header className="pr-5">
          <Dialog.Title>Are you 18 or older?</Dialog.Title>
          <Dialog.Description>This channel shows content for adults only.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Leave</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="primary">I am 18 or older</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
