import { Button } from "@krizaka/ui/button";
import { Dialog, Sheet } from "@krizaka/ui/dialog";
import { Field, Input, Textarea } from "@krizaka/ui/field";

// `Sheet` = `Dialog.Content placement="bottom"`: a form, `size="lg"`.
export default function DialogSheetForm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger asChild>
        <Button>Edit</Button>
      </Dialog.Trigger>
      <Sheet closeLabel="Close" size="lg">
        <Dialog.Header>
          <Dialog.Title>Edit the video</Dialog.Title>
          <Dialog.Description>The title and the description are public.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-4">
          <Field.Root>
            <Field.Label htmlFor="video-title">Title</Field.Label>
            <Input id="video-title" defaultValue="Night ride across the city" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor="video-description">Description</Field.Label>
            <Textarea id="video-description" defaultValue="Ten minutes of neon, rain and empty avenues." />
          </Field.Root>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Save</Button>
        </Dialog.Footer>
      </Sheet>
    </Dialog.Root>
  );
}
