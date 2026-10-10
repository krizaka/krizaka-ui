import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { Field, Input } from "@krizaka/ui/field";

// `placement="right"`: a side panel, full height.
export default function DialogRight({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger asChild>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog.Content closeLabel="Close" placement="right">
        <Dialog.Header>
          <Dialog.Title>Invite a collaborator</Dialog.Title>
          <Dialog.Description>They get access to the drafts of this channel.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Field.Root>
            <Field.Label htmlFor="invite-email-right">Email</Field.Label>
            <Input id="invite-email-right" type="email" placeholder="name@example.com" />
          </Field.Root>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Send the invitation</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
